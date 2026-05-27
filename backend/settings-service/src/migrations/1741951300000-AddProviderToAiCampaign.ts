import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProviderToAiCampaign1741951300000 implements MigrationInterface {
    name = 'AddProviderToAiCampaign1741951300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add 'provider' column with default 'retell'
        await queryRunner.query(`
            ALTER TABLE "ai_campaigns" 
            ADD COLUMN IF NOT EXISTS "provider" character varying NOT NULL DEFAULT 'retell'
        `);

        // 2. Set provider to 'bolna' for campaign 14 specifically
        await queryRunner.query(`
            UPDATE "ai_campaigns" 
            SET "provider" = 'bolna', 
                "retell_agent_id" = 'e10a840c-f9ef-40fc-b36a-3f198d805fa9',
                "language" = 'Telugu'
            WHERE "id" = 14
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_campaigns" DROP COLUMN "provider"`);
    }
}
