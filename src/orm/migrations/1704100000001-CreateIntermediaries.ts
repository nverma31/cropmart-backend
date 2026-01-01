import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIntermediaries1704100000001 implements MigrationInterface {
    name = 'CreateIntermediaries1704100000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "intermediaries" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "business_name" character varying(200),
        "business_type" character varying(100),
        "gst_number" character varying(20),
        "address" character varying(255),
        "district" character varying(100),
        "state" character varying(100),
        "pincode" character varying(10),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_intermediaries_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_intermediaries" PRIMARY KEY ("id"),
        CONSTRAINT "FK_intermediaries_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "intermediaries"`);
    }
}
