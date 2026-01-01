import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersForCropmart1704100000000 implements MigrationInterface {
    name = 'UpdateUsersForCropmart1704100000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add phone column
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_phone" UNIQUE ("phone")`);

        // Add isActive column
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);

        // Make email nullable
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);

        // Make password nullable
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);

        // Update role column default and existing values
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'FARMER'`);

        // Drop username column (not needed in Cropmart)
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "username"`);

        // Drop language column (not needed in Cropmart)
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "language"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back language column
        await queryRunner.query(`ALTER TABLE "users" ADD "language" character varying(15) NOT NULL DEFAULT 'en-US'`);

        // Add back username column
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);

        // Revert role default
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STANDARD'`);

        // Make password not nullable
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);

        // Make email not nullable
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);

        // Drop isActive column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);

        // Drop phone column
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }
}
