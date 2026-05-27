import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAiCallingForRetell1741951200000 implements MigrationInterface {
    name = 'UpdateAiCallingForRetell1741951200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if columns exist before renaming to avoid errors if partially applied
        await queryRunner.query(`
            DO $$ 
            BEGIN 
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_campaigns' AND column_name='vapi_assistant_id') THEN
                    ALTER TABLE "ai_campaigns" RENAME COLUMN "vapi_assistant_id" TO "retell_agent_id";
                END IF;
                
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_leads' AND column_name='vapi_call_id') THEN
                    ALTER TABLE "ai_leads" RENAME COLUMN "vapi_call_id" TO "retell_call_id";
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_leads" RENAME COLUMN "retell_call_id" TO "vapi_call_id"`);
        await queryRunner.query(`ALTER TABLE "ai_campaigns" RENAME COLUMN "retell_agent_id" TO "vapi_assistant_id"`);
    }
}
