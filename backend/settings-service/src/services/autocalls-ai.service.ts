import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AutocallsAiService {
  private readonly autocallsApiUrl = 'https://app.autocalls.ai/api';

  constructor(private readonly configService: ConfigService) {}

  private get apiKey() {
    return this.configService.get<string>('AUTOCALLS_API_KEY');
  }

  /**
   * Initiates an outbound call via Autocalls.ai
   * Endpoint: /user/make_call
   */
  async initiateCall(payload: {
    assistant_id: number;
    phone_number: string;
    input_variables?: Record<string, any>;
  }) {
    console.log('[Autocalls] Initiating Call to:', payload.phone_number);
    try {
      if (!this.apiKey) {
        throw new Error('AUTOCALLS_API_KEY is missing from environment variables');
      }

      const response = await axios.post(
        `${this.autocallsApiUrl}/user/make_call`,
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
      console.error('--- AUTOCALLS API ERROR START ---');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(apiError, null, 2));
      console.error('Message:', error.message);
      console.error('--- AUTOCALLS API ERROR END ---');
      
      const detailedMessage = apiError?.message || apiError?.error || error.message;
      throw new Error(`Autocalls API: ${detailedMessage}`);
    }
  }

  /**
   * Fetch call execution details
   * Endpoint: /user/calls/{id}
   */
  async getCallDetails(callId: string) {
    try {
      const response = await axios.get(
        `${this.autocallsApiUrl}/user/calls/${callId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('[Autocalls] Failed to fetch call details:', error.message);
      throw error;
    }
  }

  /**
   * Fetch assistant configuration details
   * Endpoint: /user/assistants/get
   */
  async getAssistants() {
    try {
      const response = await axios.get(
        `${this.autocallsApiUrl}/user/assistants/get`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      return response.data; // This usually returns an array of assistants
    } catch (error) {
      const apiError = error.response?.data;
      console.error('[Autocalls] Failed to fetch assistants:', apiError || error.message);
      throw new Error(apiError?.message || apiError?.error || error.message);
    }
  }

  /**
   * Verify a specific assistant ID
   */
  async verifyAssistant(assistantId: number) {
    try {
      const assistants = await this.getAssistants();
      // Adjust based on actual API response structure. 
      // Usually it's an array or an object with an array.
      const list = Array.isArray(assistants) ? assistants : (assistants.assistants || []);
      const assistant = list.find((a: any) => a.id === assistantId || a.assistant_id === assistantId);
      
      if (!assistant) {
        throw new Error(`Assistant with ID ${assistantId} not found in your Autocalls account.`);
      }
      return assistant;
    } catch (error) {
      throw error;
    }
  }
}
