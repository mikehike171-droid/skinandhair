import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PatientPackage } from './patient-package.entity';
import { PackageService } from './package-service.entity';
import { PatientExamination } from './patient-examination.entity';

@Entity('patient_package_usages')
export class PatientPackageUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_package_id: number;

  @ManyToOne(() => PatientPackage)
  @JoinColumn({ name: 'patient_package_id' })
  patient_package: PatientPackage;

  @Column()
  package_service_id: number;

  @ManyToOne(() => PackageService)
  @JoinColumn({ name: 'package_service_id' })
  package_service: PackageService;

  @Column()
  examination_id: number;

  @ManyToOne(() => PatientExamination)
  @JoinColumn({ name: 'examination_id' })
  examination: PatientExamination;

  @Column({ type: 'int', default: 1 })
  sessions_used: number;

  @CreateDateColumn()
  used_at: Date;
}
