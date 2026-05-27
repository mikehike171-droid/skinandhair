import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiCallingService } from '../services/ai-calling.service';
import { SarvamAiService } from '../services/sarvam-ai.service';

@ApiTags('AI Calling')
@Controller('ai-calling')
export class AiCallingController {
  constructor(
    private readonly aiCallingService: AiCallingService,
    private readonly sarvamAiService: SarvamAiService,
  ) {}

  @Post('campaign')
  @ApiOperation({ summary: 'Create a new AI calling campaign' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        systemPrompt: { type: 'string' },
        model: { type: 'string' },
        language: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['name', 'systemPrompt', 'file'],
    },
  })
  async createCampaign(@Body() campaignData: any, @UploadedFile() file: Express.Multer.File) {
    return this.aiCallingService.createCampaign(campaignData, file);
  }

  @Get('campaigns')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all AI calling campaigns' })
  async getCampaigns() {
    return this.aiCallingService.getCampaigns();
  }

  @Get('campaigns/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get campaign details and leads' })
  async getCampaignDetails(@Param('id') id: string) {
    return this.aiCallingService.getCampaignDetails(+id);
  }

  @Post('campaigns/:id/start')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Start an AI calling campaign' })
  async startCampaign(@Param('id') id: string) {
    return this.aiCallingService.startCampaign(+id);
  }

  @Post('campaigns/:id/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update campaign settings' })
  async updateCampaign(@Param('id') id: string, @Body() updateData: any) {
    return this.aiCallingService.updateCampaign(+id, updateData);
  }

  @Post('campaigns/:id/retry-failed')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retry failed leads in a campaign' })
  async retryFailedLeads(@Param('id') id: string) {
    return this.aiCallingService.retryFailedLeads(+id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'AI Call Status Webhook (Autocalls)' })
  async handleWebhook(@Body() payload: any) {
    return this.aiCallingService.handleWebhook(payload);
  }

  @Post('campaigns/:id/leads')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a single lead to a campaign' })
  async addLead(@Param('id') id: string, @Body() leadData: any) {
    return this.aiCallingService.addLead(+id, leadData);
  }

  @Post('leads/:id/sync')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Manually sync a lead status from Autocalls.ai' })
  async syncLeadStatus(@Param('id') id: string) {
    return this.aiCallingService.syncLeadStatus(+id);
  }

  @Post('verify-agent')
  @ApiOperation({ summary: 'Verify if an Autocalls/Sarvam Assistant ID is valid' })
  async verifyAgent(@Body() body: any) {
    const { agentId, provider } = body;
    console.log(`[Controller] Verifying Agent ID: ${agentId} for provider: ${provider}`);
    try {
      if (!agentId) throw new Error('Agent ID is missing');
      if (provider === 'sarvam') {
        return await this.sarvamAiService.verifyAgent(agentId);
      }
      return await this.aiCallingService.verifyAgent(agentId);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('sarvam/synthesize')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Synthesize Telugu voice from text' })
  async synthesizeTelugu(@Body() body: { text: string; speaker?: string }) {
    const { text, speaker } = body;
    console.log('[Controller] Synthesizing Telugu speech:', text);
    try {
      if (!text) throw new Error('Text to synthesize is missing');
      return await this.sarvamAiService.synthesizeTelugu(text, speaker);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('debug-test-call')
  @ApiOperation({ summary: 'Test a call to your phone for diagnosis' })
  async debugTestCall() {
    return this.aiCallingService.debugTestCall();
  }

  @Get('twiml/voice')
  @ApiOperation({ summary: 'Generate TwiML to play Telugu audio' })
  async getTwimlVoice(@Query('text') text: string, @Req() req, @Res() res) {
    const host = req.headers.host || 'brilliant-splashing-playing.ngrok-free.dev';
    const baseUrl = `https://${host}`;
    const audioUrl = `${baseUrl}/api/ai-calling/twiml/audio?text=${encodeURIComponent(text)}`;
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
  <Gather input="speech" language="te-IN" timeout="3" speechTimeout="auto" action="${baseUrl}/api/ai-calling/twiml/respond" method="POST"/>
</Response>`;
    
    res.type('text/xml');
    res.send(twiml);
  }

  @Get('twiml/audio')
  @ApiOperation({ summary: 'Stream dynamic synthesized Telugu audio for Twilio' })
  async getTwimlAudio(@Query('text') text: string, @Res() res) {
    console.log('[TwiML Audio] Streaming Telugu TTS for Twilio:', text);
    try {
      const response = await this.sarvamAiService.synthesizeTelugu(text, 'meera');
      if (response && response.audio) {
        const audioBuffer = Buffer.from(response.audio, 'base64');
        res.type('audio/wav');
        res.send(audioBuffer);
      } else {
        throw new Error('Synthesis response missing audio');
      }
    } catch (err) {
      console.error('[TwiML Audio Error] Failed to stream:', err);
      res.status(500).send('Error generating audio');
    }
  }

  @Post('twiml/respond')
  @ApiOperation({ summary: 'Handle Twilio Speech Gather webhook response for Conversational Telugu AI' })
  async handleTwimlRespond(@Body() body: any, @Req() req, @Res() res) {
    const transcription = body.SpeechResult || '';
    console.log('[TwiML Respond] Patient spoke:', transcription);
    
    const host = req.headers.host || 'brilliant-splashing-playing.ngrok-free.dev';
    const baseUrl = `https://${host}`;
    
    let replyText = '';
    if (!transcription.trim()) {
      replyText = 'నమస్కారం, దయచేసి మీ సమస్యను మళ్ళీ చెప్పండి.';
    } else {
      replyText = await this.sarvamAiService.getTeluguAiResponse(transcription);
    }
    
    const audioUrl = `${baseUrl}/api/ai-calling/twiml/audio?text=${encodeURIComponent(replyText)}`;
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
  <Gather input="speech" language="te-IN" timeout="3" speechTimeout="auto" action="${baseUrl}/api/ai-calling/twiml/respond" method="POST"/>
</Response>`;
    
    res.type('text/xml');
    res.send(twiml);
  }
}
