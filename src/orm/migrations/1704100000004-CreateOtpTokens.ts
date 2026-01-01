import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpTokens1704100000004 implements MigrationInterface {
    name = 'CreateOtpTokens1704100000004';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "otp_tokens" (
        "id" SERIAL NOT NULL,
        "phone" character varying(15) NOT NULL,
        "otp" character varying(100) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "is_used" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_otp_tokens" PRIMARY KEY ("id")
      )
    `);

        // Create index for phone lookups
        await queryRunner.query(`CREATE INDEX "IDX_otp_tokens_phone" ON "otp_tokens" ("phone")`);
        await queryRunner.query(`CREATE INDEX "IDX_otp_tokens_expires_at" ON "otp_tokens" ("expires_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_otp_tokens_expires_at"`);
        await queryRunner.query(`DROP INDEX "IDX_otp_tokens_phone"`);
        await queryRunner.query(`DROP TABLE "otp_tokens"`);
    }
}
