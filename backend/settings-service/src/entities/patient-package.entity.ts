import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Package } from './package.entity';

@Entity('patient_packages')
export class PatientPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'patient_id' })
  patient: Patient;

  @Column()
  package_id: number;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ type: 'date' })
  purchase_date: Date;

  @Column({ type: 'date' })
  expiry_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_paid: number;

  @Column({ default: 'Active' }) // 'Active', 'Expired', 'Completed'
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
