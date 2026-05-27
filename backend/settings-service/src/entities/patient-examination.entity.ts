import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patient_examination')
export class PatientExamination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'past_medical_reports', type: 'text', nullable: true })
  pastMedicalReports: string;

  @Column({ name: 'investigations_required', type: 'text', nullable: true })
  investigationsRequired: string;

  @Column({ name: 'physical_examination', type: 'text', nullable: true })
  physicalExamination: string;

  @Column({ name: 'file', type: 'text', nullable: true })
  file: string;

  @Column({ name: 'services', type: 'jsonb', nullable: true, default: [] })
  services: any[];

  @Column({ name: 'consultation_status', type: 'text', nullable: true })
  consultationStatus: string;

  @Column({ name: 'patient_history', type: 'text', nullable: true })
  patientHistory: string;

  @Column({ name: 'doctor_observation', type: 'text', nullable: true })
  doctorObservation: string;

  @Column({ name: 'treatment_plan_months_doctor', nullable: true })
  treatmentPlanMonthsDoctor: number;

  @Column({ name: 'next_renewal_date_doctor', type: 'date', nullable: true })
  nextRenewalDateDoctor: Date;

  @Column({ name: 'treatment_plan_months_pro', nullable: true })
  treatmentPlanMonthsPro: number;

  @Column({ name: 'next_renewal_date_pro', type: 'date', nullable: true })
  nextRenewalDatePro: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ name: 'due_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  dueAmount: number;

  @Column({ name: 'referral_code', type: 'text', nullable: true })
  referralCode: string;

  @Column({ name: 'agent', type: 'text', nullable: true })
  agent: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  doctor_name?: string;
}
