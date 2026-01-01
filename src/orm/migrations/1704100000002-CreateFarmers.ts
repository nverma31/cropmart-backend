import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarmers1704100000002 implements MigrationInterface {
    name = 'CreateFarmers1704100000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "farmers" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "intermediary_id" integer,
        "address" character varying(255),
        "district" character varying(100),
        "state" character varying(100),
        "pincode" character varying(10),
        "land_holding" character varying(50),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_farmers_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_farmers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_farmers_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_farmers_intermediary" FOREIGN KEY ("intermediary_id") REFERENCES "intermediaries"("id") ON DELETE SET NULL
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "farmers"`);
    }
}
