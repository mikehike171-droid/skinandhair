import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pharmacy_payment_installments')
export class PharmacyPaymentInstallment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pharmacy_billing_id' })
  pharmacyBillingId: number;

  @Column({ name: 'installment_number' })
  installmentNumber: number;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'payment_date' })
  paymentDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
