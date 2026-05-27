import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiCampaign } from '../entities/ai-campaign.entity';
import { AiLead } from '../entities/ai-lead.entity';
import * as XLSX from 'xlsx';
import { ConfigService } from '@nestjs/config';
import { EdesyAiService } from './edesy-ai.service';
import { SarvamAiService } from './sarvam-ai.service';
import * as twilio from 'twilio';
import axios from 'axios';

@Injectable()
export class AiCallingService {

  constructor(
    @InjectRepository(AiCampaign)
    private readonly campaignRepository: Repository<AiCampaign>,
    @InjectRepository(AiLead)
    private readonly leadRepository: Repository<AiLead>,
    private readonly edesyAiService: EdesyAiService,
    private readonly sarvamAiService: SarvamAiService,
    private readonly configService: ConfigService,
  ) {}

  async createCampaign(campaignData: any, file: Express.Multer.File) {
    console.log('Creating Edesy campaign:', campaignData.name);
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }
    
    // 1. Parse Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const leadsData: any[] = XLSX.utils.sheet_to_json(sheet);

    if (!leadsData.length) {
      throw new BadRequestException('Excel sheet is empty');
    }

    // 2. Create Campaign
    const campaign = this.campaignRepository.create({
      name: campaignData.name,
      description: campaignData.description,
      systemPrompt: campaignData.systemPrompt,
      model: campaignData.model || 'gpt-4o',
      language: campaignData.language || 'Telugu',
      provider: campaignData.provider || 'sarvam',
      totalLeads: leadsData.length,
      status: 'Pending',
      retellAgentId: campaignData.retellAgentId || 'sarvam-telugu-agent-1',
    });

    const savedCampaign = await this.campaignRepository.save(campaign);

    // 3. Save Leads
    const leads = leadsData
      .filter((data) => data.Phone || data.phone || data.PhoneNumber || data['Phone Number'])
      .map((data) => {
        return this.leadRepository.create({
          campaignId: savedCampaign.id,
          phoneNumber: data.Phone || data.phone || data.PhoneNumber || data['Phone Number'],
          customerName: data.Name || data.name || data.CustomerName || data['Customer Name'],
          language: data.Language || data.language || savedCampaign.language,
          status: 'Pending',
        });
      });

    if (leads.length === 0) {
      throw new BadRequestException('No valid leads found in Excel.');
    }

    await this.leadRepository.save(leads);
    return savedCampaign;
  }

  async getCampaigns() {
    return this.campaignRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getCampaignDetails(id: number) {
    return this.campaignRepository.findOne({
      where: { id },
      relations: ['leads'],
      order: { leads: { id: 'ASC' } }
    });
  }

  async updateCampaign(id: number, updateData: any) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) throw new BadRequestException('Campaign not found');

    if (updateData.name) campaign.name = updateData.name;
    if (updateData.language) campaign.language = updateData.language;
    if (updateData.systemPrompt) campaign.systemPrompt = updateData.systemPrompt;
    if (updateData.model) campaign.model = updateData.model;
    if (updateData.retellAgentId) campaign.retellAgentId = updateData.retellAgentId;

    return this.campaignRepository.save(campaign);
  }

  async startCampaign(id: number) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) throw new BadRequestException('Campaign not found');

    campaign.status = 'In-Progress';
    await this.campaignRepository.save(campaign);

    return this.callNextLead(id);
  }
  async addLead(campaignId: number, leadData: any) {
    const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });
    if (!campaign) throw new BadRequestException('Campaign not found');

    const lead = this.leadRepository.create({
      campaignId,
      phoneNumber: leadData.phoneNumber,
      customerName: leadData.customerName || 'Test User',
      status: 'Pending',
    });

    await this.leadRepository.save(lead);

    // Update campaign total leads
    campaign.totalLeads += 1;
    await this.campaignRepository.save(campaign);

    return lead;
  }

  async retryFailedLeads(campaignId: number) {
    console.log(`[Service] Retrying failed leads for campaign: ${campaignId}`);
    const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });
    if (!campaign) throw new BadRequestException('Campaign not found');

    // Reset status of Failed leads to Pending
    await this.leadRepository.update(
      { campaignId, status: 'Failed' },
      { 
        status: 'Pending', 
        summary: null, 
        transcript: null, 
        retellCallId: null 
      }
    );

    // If campaign was completed or paused, set back to In-Progress if there are now pending leads
    if (campaign.status !== 'In-Progress') {
      campaign.status = 'In-Progress';
      await this.campaignRepository.save(campaign);
    }

    return this.callNextLead(campaignId);
  }

  async callNextLead(campaignId: number) {
    const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });
    if (!campaign || campaign.status !== 'In-Progress') return;

    const nextLead = await this.leadRepository.findOne({
      where: { campaignId, status: 'Pending' },
      order: { id: 'ASC' },
    });

    if (!nextLead) {
      campaign.status = 'Completed';
      await this.campaignRepository.save(campaign);
      return { message: 'Campaign completed' };
    }

    try {
      let phone = String(nextLead.phoneNumber || '').trim();
      if (!phone) throw new Error('Phone number is empty');

      if (phone.length === 10 && !phone.startsWith('+')) {
        phone = `+91${phone}`;
      } else if (phone.length === 12 && phone.startsWith('91')) {
        phone = `+${phone}`;
      } else if (!phone.startsWith('+')) {
        phone = `+${phone}`;
      }

      const agentId = campaign.retellAgentId;
      let callId: string;
      let message: string;

      if (campaign.provider === 'sarvam') {
        console.log(`[Campaign ${campaignId}] Initiating Sarvam Call to: ${phone}`);
        const sarvamResult = await this.sarvamAiService.initiateCall({
          phoneNumber: phone,
          customerName: nextLead.customerName || 'Customer',
          systemPrompt: campaign.systemPrompt,
          voice: 'meera',
        });
        callId = sarvamResult.callId;
        message = 'Call initiated via Sarvam AI';
      } else {
        if (!agentId) throw new Error('Agent ID is missing for this campaign');
        console.log(`[Campaign ${campaignId}] Initiating Edesy Call to: ${phone} (Agent: ${agentId})`);
        const edesyResult = await this.edesyAiService.initiateCall({
          agentId: parseInt(agentId),
          phoneNumber: phone,
          customFields: {
            customerName: nextLead.customerName || 'Customer',
            leadId: nextLead.id,
            systemPrompt: campaign.systemPrompt
          }
        });
        callId = String(edesyResult.callId || edesyResult.id || edesyResult.data?.id);
        message = 'Call initiated via Edesy.in';
      }
      
      console.log(`[Campaign ${campaignId}] Success! Call ID: ${callId}`);

      nextLead.status = 'In-Progress';
      nextLead.retellCallId = callId;
      await this.leadRepository.save(nextLead);

      return { message, lead: nextLead };
    } catch (error) {
      const errorDetail = error.response?.data?.message || error.message;
      console.error(`[Campaign ${campaignId}] Initiation Failed for ${nextLead.phoneNumber}:`, errorDetail);
      
      nextLead.status = 'Failed';
      nextLead.summary = `Error: ${errorDetail}`;
      await this.leadRepository.save(nextLead);
      
      return this.callNextLead(campaignId);
    }
  }

  async syncLeadStatus(leadId: number) {
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) throw new BadRequestException('Lead not found');

    const executionId = lead.retellCallId;
    if (!executionId) return { success: false, message: 'No call ID' };

    try {
      let callData: any;
      const campaign = await this.campaignRepository.findOne({ where: { id: lead.campaignId } });
      
      if (campaign?.provider === 'sarvam') {
        console.log(`[Sync] Fetching Sarvam status for lead #${lead.id} via ID: ${executionId}`);
        callData = await this.sarvamAiService.getCallDetails(executionId, lead.customerName);
      } else {
        console.log(`[Sync] Fetching Edesy status for lead #${lead.id} via ID: ${executionId}`);
        callData = await this.edesyAiService.getCallDetails(executionId);
      }
      
      const currentStatus = (callData.status || callData.callStatus || '').toLowerCase();
      console.log(`[Sync] Call Status for #${lead.id}: ${currentStatus}`);

      // Final statuses
      const isFinished = ['completed', 'ended', 'successful', 'disconnected'].includes(currentStatus);
      const isFailed = ['failed', 'rejected', 'busy', 'no-answer', 'error'].includes(currentStatus);

      if (isFinished) {
        lead.status = 'Completed';
        lead.callDuration = callData.duration || 0;
        lead.transcript = callData.transcript || '';
        lead.summary = callData.summary || 'Call completed.';
        
        await this.leadRepository.save(lead);

        const campaign = await this.campaignRepository.findOne({ where: { id: lead.campaignId } });
        if (campaign && campaign.status === 'In-Progress') {
          const completedCount = await this.leadRepository.count({ where: { campaignId: campaign.id, status: 'Completed' } });
          campaign.completedLeads = completedCount;
          if (campaign.completedLeads >= campaign.totalLeads) campaign.status = 'Completed';
          await this.campaignRepository.save(campaign);

          // Start next lead
          const hasMore = await this.leadRepository.findOne({ where: { campaignId: campaign.id, status: 'Pending' } });
          if (hasMore) {
            setTimeout(() => this.callNextLead(campaign.id), 500);
          }
        }
        return { success: true, status: 'Completed', lead };
      } else if (isFailed) {
        lead.status = 'Failed';
        lead.summary = `Edesy: ${currentStatus}`;
        await this.leadRepository.save(lead);
        
        const campaign = await this.campaignRepository.findOne({ where: { id: lead.campaignId } });
        if (campaign && campaign.status === 'In-Progress') {
          this.callNextLead(campaign.id);
        }
        return { success: true, status: 'Failed', lead };
      }
      
      return { success: true, status: currentStatus, lead };
    } catch (error) {
      console.error(`[Sync] Edesy sync failed for #${leadId}:`, error.message);
      return { success: false, message: error.message };
    }
  }

  async handleWebhook(payload: any) {
    console.log('[Webhook] Received Edesy Event:', JSON.stringify(payload, null, 2));
    
    const executionId = payload.callId || payload.id;
    const leadIdFromPayload = payload.customFields?.leadId || payload.leadId;

    if (!executionId && !leadIdFromPayload) {
      return { status: 'ignored' };
    }

    let lead = null;
    if (leadIdFromPayload) {
      lead = await this.leadRepository.findOne({ where: { id: leadIdFromPayload } });
    } else {
      lead = await this.leadRepository.findOne({ where: { retellCallId: executionId.toString() } });
    }

    if (lead) {
      return this.syncLeadStatus(lead.id);
    }

    return { status: 'lead_not_found' };
  }

  async verifyAgent(agentId: string) {
    console.log(`[Service] Verifying Edesy Agent ID: ${agentId}`);
    try {
      const agent = await this.edesyAiService.verifyAgent(parseInt(agentId));
      return {
        success: true,
        message: 'Edesy Agent verified!',
        agentName: agent.name,
        provider: 'edesy'
      };
    } catch (error) {
      return { success: false, message: `Verification failed: ${error.message}`, provider: 'edesy' };
    }
  }

  async debugTestCall() {
    const testNumber = '+917382110030'; 
    
    const twilioSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const twilioToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const twilioFrom = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    if (twilioSid && twilioToken && twilioFrom) {
      console.log(`[Twilio Call] Initiating REAL dynamic Telugu outbound call via Twilio + Sarvam AI to: ${testNumber}`);
      try {
        const client = new twilio.Twilio(twilioSid, twilioToken);
        const greeting = 'నమస్కారం, నా పేరు రోజా. నేను వి ప్రైడ్ స్కిన్ అండ్ హెయిర్ నుండి మాట్లాడుతున్నాను. మీకు ఏమైనా ఆరోగ్య సమస్యలు ఉన్నాయా?';
        
        // Dynamically detect active ngrok tunnel URL
        let publicUrl = 'https://brilliant-splashing-playing.ngrok-free.dev';
        try {
          const ngrokResponse = await axios.get('http://127.0.0.1:4040/api/tunnels');
          const tunnel = ngrokResponse.data?.tunnels?.[0];
          if (tunnel && tunnel.public_url) {
            publicUrl = tunnel.public_url;
            console.log(`[Twilio Call] Dynamically detected active ngrok URL: ${publicUrl}`);
          }
        } catch (ngrokErr) {
          console.log('[Twilio Call] Failed to query local ngrok API, using fallback:', ngrokErr.message);
        }

        const twimlUrl = `${publicUrl}/api/ai-calling/twiml/voice?text=${encodeURIComponent(greeting)}`;
        
        const call = await client.calls.create({
          url: twimlUrl,
          to: testNumber,
          from: twilioFrom,
        });

        // Also register the simulated database state so it instantly appears on the dashboard!
        const simResult = await this.sarvamAiService.initiateCall({
          phoneNumber: testNumber,
          customerName: 'Test Patient',
          systemPrompt: greeting,
          voice: 'meera',
        });

        return {
          success: true,
          message: 'REAL Conversational Telugu AI Call successfully initiated! Watch your phone ring now!',
          details: { callSid: call.sid, simResult }
        };
      } catch (error) {
        console.error('[Twilio Error] Failed to initiate call:', error);
        return { success: false, error: `Twilio Outbound API: ${error.message}` };
      }
    }

    // Fallback to simulator
    console.log(`[Test Call] Running Sarvam AI Telugu calling simulator for: ${testNumber}`);
    try {
      const result = await this.sarvamAiService.initiateCall({
        phoneNumber: testNumber,
        customerName: 'Test Patient',
        systemPrompt: 'Namaskaram, na peru Rooja nenu Vpride skin and hair nundi matladuthunna meku Em anna Arogya samasyalu Unnaya?',
        voice: 'meera',
      });
      return { 
        success: true, 
        message: 'Sarvam AI Telugu Call Simulator initiated! Status will auto-sync with high-fidelity Telugu transcripts.', 
        details: result 
      };
    } catch (error) {
      return { success: false, error: `Sarvam AI: ${error.message}` };
    }
  }
}
