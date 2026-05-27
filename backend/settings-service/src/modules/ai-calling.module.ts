import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiCallingController } from '../controllers/ai-calling.controller';
import { AiCallingService } from '../services/ai-calling.service';
import { AiCampaign as CampaignEntity } from '../entities/ai-campaign.entity';
import { AiLead } from '../entities/ai-lead.entity';
import { HttpModule } from '@nestjs/axios';
import { EdesyAiService } from '../services/edesy-ai.service';
import { SarvamAiService } from '../services/sarvam-ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity, AiLead]),
    HttpModule,
  ],
  controllers: [AiCallingController],
  providers: [AiCallingService, EdesyAiService, SarvamAiService],
  exports: [AiCallingService, EdesyAiService, SarvamAiService],
})
export class AiCallingModule {}
