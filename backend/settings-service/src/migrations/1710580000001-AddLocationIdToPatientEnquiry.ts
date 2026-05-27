import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationIdToPatientEnquiry1710580000001 implements MigrationInterface {
    name = 'AddLocationIdToPatientEnquiry1710580000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_enquiries" ADD COLUMN IF NOT EXISTS "location_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_enquiries" DROP COLUMN IF NOT EXISTS "location_id"`);
    }
}
