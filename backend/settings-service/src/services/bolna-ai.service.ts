import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BolnaAiService {
  private readonly bolnaApiUrl = 'https://api.bolna.ai';

  constructor(private readonly configService: ConfigService) {}

  private get apiKey() {
    return this.configService.get<string>('BOLNA_API_KEY');
  }

  /**
   * Initiates an outbound call via Bolna AI
   * Bolna V2 Endpoint: /call
   */
  async initiateCall(payload: {
    agent_id: string;
    recipient_phone_number: string;
    from_phone_number?: string;
    user_data?: Record<string, any>;
    agent_data?: Record<string, any>;
    metadata?: Record<string, any>;
  }) {
    console.log('[Bolna] Initiating Call to:', payload.recipient_phone_number);
    try {
      if (!this.apiKey) {
        throw new Error('BOLNA_API_KEY is missing from environment variables');
      }

      const response = await axios.post(
        `${this.bolnaApiUrl}/call`,
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
      console.error('--- BOLNA API ERROR START ---');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(apiError, null, 2));
      console.error('Message:', error.message);
      console.error('--- BOLNA API ERROR END ---');
      
      const detailedMessage = apiError?.message || apiError?.error || error.message;
      throw new Error(`Bolna API: ${detailedMessage}`);
    }
  }

  /**
   * Fetch agent configuration details to verify connectivity
   */
  async getAgentDetails(agentId: string) {
    try {
      const response = await axios.get(
        `${this.bolnaApiUrl}/agent/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      const apiError = error.response?.data;
      console.error('[Bolna] Failed to fetch agent details:', apiError || error.message);
      throw new Error(apiError?.message || apiError?.error || error.message);
    }
  }

  /**
   * Fetch call execution details
   */
  async getCallDetails(executionId: string) {
    try {
      const response = await axios.get(
        `${this.bolnaApiUrl}/execution/${executionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('[Bolna] Failed to fetch call details:', error.message);
      throw error;
    }
  }
}
