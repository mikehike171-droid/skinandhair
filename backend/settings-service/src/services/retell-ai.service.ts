import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RetellAiService {
  private readonly retellApiUrl = 'https://api.retellai.com';

  constructor(private readonly configService: ConfigService) {}

  private get apiKey() {
    return this.configService.get<string>('RETELL_API_KEY');
  }

  async initiateCall(payload: {
    from_number: string;
    to_number: string;
    agent_id: string;
    override_agent_config?: Record<string, any>;
    metadata?: Record<string, any>;
  }) {
    console.log('Initiating Retell AI Call to:', payload.to_number);
    try {
      if (!this.apiKey) {
        console.error('CRITICAL: RETELL_API_KEY is missing from environment variables!');
      } else {
        console.log('RETELL_API_KEY is loaded (prefix:', this.apiKey.substring(0, 4) + '...)');
      }

      const response = await axios.post(
        `${this.retellApiUrl}/v2/create-phone-call`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      console.error('--- RETELL API ERROR START ---');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(apiError, null, 2));
      console.error('Message:', error.message);
      console.error('--- RETELL API ERROR END ---');
      
      const detailedMessage = apiError?.message || apiError?.error || error.message;
      throw new Error(`Retell API: ${detailedMessage}`);
    }
  }

  async getCall(callId: string) {
    const response = await axios.get(
      `${this.retellApiUrl}/v2/get-call/${callId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );
    return response.data;
  }

  async createWebCall(agentId: string) {
    console.log('[Retell] Creating Web Call for Agent:', agentId);
    try {
      const response = await axios.post(
        `${this.retellApiUrl}/v2/create-web-call`,
        { agent_id: agentId },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      console.error('[Retell] Web Call Error:', JSON.stringify(apiError, null, 2));
      throw new Error(`Retell Web Call API: ${apiError?.message || error.message}`);
    }
  }

  async updateAgent(agentId: string, data: {
    agent_name?: string;
    voice_id?: string;
    agent_prompt?: string;
    base_language?: string;
  }) {
    const response = await axios.patch(
      `${this.retellApiUrl}/v2/update-agent/${agentId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async listCalls(params: { to_number?: string; limit?: number }) {
    const response = await axios.get(
      `${this.retellApiUrl}/v2/list-calls`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        params,
      },
    );
    return response.data;
  }
}
