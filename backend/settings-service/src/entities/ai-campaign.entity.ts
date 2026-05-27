import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AiLead } from './ai-lead.entity';

@Entity('ai_campaigns')
export class AiCampaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'system_prompt', type: 'text' })
  systemPrompt: string;

  @Column({ default: 'gemini-1.5-flash' })
  model: string;

  @Column({ default: 'English' })
  language: string;

  @Column({ default: 'Pending' })
  status: string; // Pending, In-Progress, Completed, Paused

  @Column({ name: 'total_leads', default: 0 })
  totalLeads: number;

  @Column({ name: 'completed_leads', default: 0 })
  completedLeads: number;

  @Column({ name: 'retell_agent_id', nullable: true })
  retellAgentId: string;

  @Column({ default: 'edesy' })
  provider: string; // 'edesy'

  @OneToMany(() => AiLead, (lead) => lead.campaign)
  leads: AiLead[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
