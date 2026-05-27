import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAmountAndGstToServiceProduct1710580000002 implements MigrationInterface {
    name = 'AddAmountAndGstToServiceProduct1710580000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_product" ADD COLUMN IF NOT EXISTS "amount" decimal(10,2) DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "service_product" ADD COLUMN IF NOT EXISTS "gst" decimal(5,2) DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_product" DROP COLUMN IF NOT EXISTS "amount"`);
        await queryRunner.query(`ALTER TABLE "service_product" DROP COLUMN IF NOT EXISTS "gst"`);
    }
}
