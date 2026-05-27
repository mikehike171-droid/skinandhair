import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePharmacyDispatch1740617000000 implements MigrationInterface {
    name = 'CreatePharmacyDispatch1740617000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "pharmacy_dispatch" (
                "id" SERIAL PRIMARY KEY,
                "examination_id" integer NOT NULL,
                "patient_id" integer NOT NULL,
                "product_name" character varying NOT NULL,
                "doctor_quantity" integer NOT NULL DEFAULT 0,
                "doctor_days" integer NOT NULL DEFAULT 0,
                "dispatched_quantity" integer NOT NULL DEFAULT 0,
                "dispatched_days" integer NOT NULL DEFAULT 0,
                "remaining_days" integer NOT NULL DEFAULT 0,
                "due_date" date,
                "dispatch_date" date,
                "notes" text,
                "location_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_dispatch_exam" ON "pharmacy_dispatch" ("examination_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_dispatch_patient" ON "pharmacy_dispatch" ("patient_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_dispatch_location" ON "pharmacy_dispatch" ("location_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_dispatch_location"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_dispatch_patient"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_dispatch_exam"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pharmacy_dispatch"`);
    }
}
