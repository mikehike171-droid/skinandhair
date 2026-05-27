import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SarvamAiService {
  private readonly sarvamApiUrl = 'https://api.sarvam.ai';

  constructor(private readonly configService: ConfigService) {}

  private get apiKey() {
    // Return key from config, fallback to a mock/placeholder to prevent server crash if not set yet
    return this.configService.get<string>('SARVAM_API_KEY') || 'mock_key';
  }

  /**
   * Synthesize Telugu Text to Speech using Sarvam AI's bulbul:v3 model
   * Endpoint: POST /text-to-speech
   */
  async synthesizeTelugu(text: string, speaker: string = 'meera') {
    console.log('[Sarvam AI] Synthesizing Telugu speech for:', text.substring(0, 50) + '...');
    
    // Check if key is configured, fallback to standard mock behavior if it is placeholder
    if (!this.apiKey || this.apiKey === 'your_sarvam_api_key_here' || this.apiKey === 'mock_key') {
      console.warn('[Sarvam AI] API key is not configured. Returning high-quality simulated base64 audio response.');
      // Return a simulated, small base64 wav payload for offline testing/verification
      return {
        audio: 'UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA', // Valid mock silent WAV header
        format: 'wav',
        model: 'bulbul:v3',
        speaker,
        target_language_code: 'te-IN',
        simulated: true,
      };
    }

    try {
      const response = await axios.post(
        `${this.sarvamApiUrl}/text-to-speech`,
        {
          text,
          speaker,
          target_language_code: 'te-IN',
          model: 'bulbul:v3',
          speech_sample_rate: 24000,
          enable_preprocessing: true,
          pace: 1.0,
        },
        {
          headers: {
            'api-subscription-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Sarvam API returns JSON: { audios: [ "base64_encoded_string" ] }
      const base64Audio = response.data?.audios?.[0] || response.data?.audio;
      if (!base64Audio) {
        throw new Error('No audio data received in response from Sarvam AI');
      }

      return {
        audio: base64Audio,
        format: 'wav',
        model: 'bulbul:v3',
        speaker,
        target_language_code: 'te-IN',
        simulated: false,
      };
    } catch (error) {
      const apiError = error.response?.data;
      console.error('--- SARVAM AI API ERROR START ---');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(apiError, null, 2));
      console.error('Message:', error.message);
      console.error('--- SARVAM AI API ERROR END ---');
      
      const detailedMessage = apiError?.message || apiError?.error || error.message;
      throw new Error(`Sarvam AI API: ${detailedMessage}`);
    }
  }

  /**
   * Simulates/Initiates an outbound Telugu calling campaign lead via Sarvam AI
   */
  async initiateCall(payload: {
    phoneNumber: string;
    customerName: string;
    systemPrompt: string;
    voice?: string;
  }) {
    console.log('[Sarvam AI] Initiating simulated call to:', payload.phoneNumber);
    
    // We simulate a successful outbound call setup
    const callId = `sarvam_call_${Math.random().toString(36).substring(2, 11)}`;
    
    // Simulate typical agent response for the preview
    return {
      success: true,
      callId,
      provider: 'sarvam',
      details: {
        message: 'Sarvam Telugu outbound dialer sequence simulated.',
        recipient: payload.customerName,
        phone: payload.phoneNumber,
        promptUsed: payload.systemPrompt,
      }
    };
  }

  /**
   * Simulate checking agent connection/details
   */
  async verifyAgent(agentId: string) {
    console.log(`[Sarvam AI] Checking agent: ${agentId}`);
    return {
      id: agentId,
      name: `Sarvam Telugu Agent (${agentId})`,
      status: 'Active',
    };
  }

  /**
   * Get simulated details of the finished call
   */
  async getCallDetails(callId: string, leadName: string = 'Patient') {
    // Generate a beautiful, realistic, medical/skin-care Telugu call transcription and summary
    return {
      status: 'completed',
      duration: Math.floor(Math.random() * 40) + 20, // 20-60s call
      summary: `Patient ${leadName} answered in Telugu. Listened to our Rooja skin & hair opening prompt. Enquired about scheduling a hair loss consultation tomorrow morning at the clinic.`,
      transcript: `AI (Rooja): Namaskaram, na peru Rooja nenu Vpride skin and hair nundi matladuthunna meku Em anna Arogya samasyalu Unnaya?\n` +
                  `Patient: Avunu amma, naku chala rojula nundi hair fall ekkuvaga undi. Remedial treatments emaina unnaya?\n` +
                  `AI (Rooja): Tappakunda andi. Vpride Clinic lo chala manchi hair restoration treatments unnayi. Miru e roju kani, leda repu kani doctor appointment book chesukuntara?\n` +
                  `Patient: Repu podduna kuduruthundi. Appointment book cheyandi.`,
    };
  }

  /**
   * Generates a warm, dynamic chat response in Telugu using Sarvam AI's chat completion model
   */
  async getTeluguAiResponse(transcription: string): Promise<string> {
    console.log('[Sarvam AI] Generating LLM chat response for transcription:', transcription);
    if (!this.apiKey || this.apiKey === 'your_sarvam_api_key_here' || this.apiKey === 'mock_key') {
      return 'నమస్కారం, రోజా మాట్లాడుతున్నాను. మీరు వి ప్రైడ్ స్కిన్ అండ్ హెయిర్ క్లినిక్‌కి స్వాగతం.';
    }

    try {
      const response = await axios.post(
        `${this.sarvamApiUrl}/v1/chat/completions`,
        {
          model: 'sarvam-30b',
          messages: [
            {
              role: 'system',
              content: '### CRITICAL: STICK TO TELUGU ONLY ###\n- You MUST respond ONLY in Telugu (te-IN).\n- NEVER write or speak English.\n- Your name is Rooja, a female AI assistant calling from Vpride Skin and Hair Clinic.\n- Respond warmly, politely, and keep your answer very short (maximum 1 or 2 sentences) in Telugu.\n- Encourage the user to book a doctor appointment for their hair loss or skin concerns.'
            },
            {
              role: 'user',
              content: transcription
            }
          ]
        },
        {
          headers: {
            'api-subscription-key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      const reply = response.data?.choices?.[0]?.message?.content;
      if (reply) {
        return reply.trim();
      }
      return 'నమస్కారం, దయచేసి మళ్ళీ చెప్పండి.';
    } catch (error) {
      console.error('[Sarvam Chat Error] Failed to generate chat response:', error.message);
      return 'నమస్కారం, మీ ఆరోగ్య సమస్యలను నివారించడానికి మా క్లినిక్‌ను సంప్రదించండి.';
    }
  }
}
