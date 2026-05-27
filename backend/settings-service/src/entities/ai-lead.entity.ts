import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AiCampaign } from './ai-campaign.entity';

@Entity('ai_leads')
export class AiLead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'campaign_id' })
  campaignId: number;

  @ManyToOne(() => AiCampaign, (campaign) => campaign.leads)
  @JoinColumn({ name: 'campaign_id' })
  campaign: AiCampaign;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'customer_name', nullable: true })
  customerName: string;

  @Column({ nullable: true })
  language: string;

  @Column({ default: 'Pending' })
  status: string; // Pending, In-Progress, Completed, Failed

  @Column({ name: 'retell_call_id', nullable: true })
  retellCallId: string;

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ name: 'call_duration', nullable: true })
  callDuration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
