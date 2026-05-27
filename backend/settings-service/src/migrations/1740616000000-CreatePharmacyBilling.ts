import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePharmacyBilling1740616000000 implements MigrationInterface {
    name = 'CreatePharmacyBilling1740616000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "pharmacy_billing" (
                "id" SERIAL PRIMARY KEY,
                "examination_id" integer NOT NULL,
                "patient_id" integer NOT NULL,
                "total_amount" decimal(10,2) NOT NULL DEFAULT 0,
                "paid_amount" decimal(10,2) NOT NULL DEFAULT 0,
                "due_amount" decimal(10,2) NOT NULL DEFAULT 0,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "pharmacy_payment_installments" (
                "id" SERIAL PRIMARY KEY,
                "pharmacy_billing_id" integer NOT NULL,
                "installment_number" integer NOT NULL,
                "payment_method" character varying NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "notes" text,
                "payment_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Add index on examination_id for performance
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_billing_exam" ON "pharmacy_billing" ("examination_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_billing_patient" ON "pharmacy_billing" ("patient_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pharmacy_installments_billing" ON "pharmacy_payment_installments" ("pharmacy_billing_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_installments_billing"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_billing_patient"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_pharmacy_billing_exam"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pharmacy_payment_installments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pharmacy_billing"`);
    }
}
