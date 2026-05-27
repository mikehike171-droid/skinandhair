import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pharmacy_dispatch')
export class PharmacyDispatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'examination_id' })
  examinationId: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  /** The product name exactly as in the examination services array */
  @Column({ name: 'product_name' })
  productName: string;

  /** Doctor prescribed quantity */
  @Column({ name: 'doctor_quantity', default: 0 })
  doctorQuantity: number;

  /** Doctor prescribed days */
  @Column({ name: 'doctor_days', default: 0 })
  doctorDays: number;

  /** Actually dispatched quantity by pharmacy */
  @Column({ name: 'dispatched_quantity', default: 0 })
  dispatchedQuantity: number;

  /** Days worth of medicine dispatched */
  @Column({ name: 'dispatched_days', default: 0 })
  dispatchedDays: number;

  /** Remaining days = doctor_days - dispatched_days */
  @Column({ name: 'remaining_days', default: 0 })
  remainingDays: number;

  /** Due date: dispatch_date + dispatched_days */
  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  /** Date of dispatch */
  @Column({ name: 'dispatch_date', type: 'date', nullable: true })
  dispatchDate: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
