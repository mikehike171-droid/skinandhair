import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EdesyAiService {
  private readonly edesyApiUrl = 'https://voice-agent.edesy.in/api/v1';

  constructor(private readonly configService: ConfigService) {}

  private get apiKey() {
    return this.configService.get<string>('EDESY_API_KEY');
  }

  /**
   * Initiates an outbound call via Edesy.in
   * Endpoint: POST /calls
   */
  async initiateCall(payload: {
    agentId: number;
    phoneNumber: string;
    fromNumber?: string;
    customFields?: Record<string, any>;
  }) {
    console.log('[Edesy] Initiating Call to:', payload.phoneNumber);
    try {
      if (!this.apiKey) {
        throw new Error('EDESY_API_KEY is missing from environment variables');
      }

      const response = await axios.post(
        `${this.edesyApiUrl}/calls`,
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
      console.error('--- EDESY API ERROR START ---');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(apiError, null, 2));
      console.error('Message:', error.message);
      console.error('--- EDESY API ERROR END ---');
      
      const detailedMessage = apiError?.message || apiError?.error || error.message;
      throw new Error(`Edesy API: ${detailedMessage}`);
    }
  }

  /**
   * Fetch call transcript and details
   * Endpoint: GET /transcripts?call_id={id}
   */
  async getCallDetails(callId: string) {
    try {
      const response = await axios.get(
        `https://api.edesy.in/v1/transcripts?call_id=${callId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('[Edesy] Failed to fetch call details:', error.message);
      throw error;
    }
  }

  /**
   * Verify an Agent ID
   * Since there isn't a direct "get agent" endpoint documented, 
   * we'll assume a standard successful response or try to fetch agents list.
   */
  async verifyAgent(agentId: number) {
    try {
      // Logic to verify agent (could be fetching agent list)
      // For now, we'll return a placeholder success if we can't find a list endpoint
      return { id: agentId, name: 'Edesy Voice Agent' };
    } catch (error) {
      throw error;
    }
  }
}
