import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAiCallingTables1740618000000 implements MigrationInterface {
    name = 'CreateAiCallingTables1740618000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "ai_campaigns" (
                "id" SERIAL NOT NULL, 
                "name" character varying NOT NULL, 
                "description" text, 
                "system_prompt" text NOT NULL, 
                "model" character varying NOT NULL DEFAULT 'gemini-1.5-flash', 
                "language" character varying NOT NULL DEFAULT 'English', 
                "status" character varying NOT NULL DEFAULT 'Pending', 
                "total_leads" integer NOT NULL DEFAULT '0', 
                "completed_leads" integer NOT NULL DEFAULT '0', 
                "vapi_assistant_id" character varying, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_ai_campaigns" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "ai_leads" (
                "id" SERIAL NOT NULL, 
                "campaign_id" integer NOT NULL, 
                "phone_number" character varying NOT NULL, 
                "customer_name" character varying, 
                "language" character varying, 
                "status" character varying NOT NULL DEFAULT 'Pending', 
                "vapi_call_id" character varying, 
                "transcript" text, 
                "summary" text, 
                "call_duration" integer, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_ai_leads" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ai_leads"`);
        await queryRunner.query(`DROP TABLE "ai_campaigns"`);
    }
}
