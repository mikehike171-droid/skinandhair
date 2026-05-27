import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pharmacy_billing')
export class PharmacyBilling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'examination_id' })
  examinationId: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ name: 'due_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  dueAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
