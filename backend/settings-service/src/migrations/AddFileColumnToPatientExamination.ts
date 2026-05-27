import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileColumnToPatientExamination1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE patient_examination 
            ADD COLUMN IF NOT EXISTS file TEXT;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE patient_examination 
            DROP COLUMN IF EXISTS file;
        `);
    }
}
