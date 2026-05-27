import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientEnquiryTable1710580000000 implements MigrationInterface {
  name = 'CreatePatientEnquiryTable1710580000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS patient_enquiries (
        id SERIAL PRIMARY KEY,
        contact_number VARCHAR(20) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        enquiry_for VARCHAR(255) NOT NULL,
        enquiry_type VARCHAR(255) NOT NULL,
        response TEXT,
        date_to_follow DATE NOT NULL,
        source_of_enquiry VARCHAR(255) NOT NULL,
        lead_representative VARCHAR(255),
        lead_status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_patient_enquiries_contact_number ON patient_enquiries(contact_number);
      CREATE INDEX idx_patient_enquiries_patient_name ON patient_enquiries(patient_name);
      CREATE INDEX idx_patient_enquiries_lead_status ON patient_enquiries(lead_status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS patient_enquiries CASCADE;`);
  }
}
