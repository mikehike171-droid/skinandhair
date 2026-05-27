import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patient_enquiries')
export class PatientEnquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'contact_number' })
  contactNumber: string;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'enquiry_for' })
  enquiryFor: string;

  @Column({ name: 'enquiry_type' })
  enquiryType: string;

  @Column({ nullable: true })
  response: string;

  @Column({ name: 'date_to_follow', type: 'date' })
  dateToFollow: string;

  @Column({ name: 'source_of_enquiry' })
  sourceOfEnquiry: string;

  @Column({ name: 'lead_representative', nullable: true })
  leadRepresentative: string;

  @Column({ name: 'lead_status', default: 'Pending' })
  leadStatus: string;
  
  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
