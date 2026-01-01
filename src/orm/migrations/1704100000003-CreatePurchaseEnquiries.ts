import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePurchaseEnquiries1704100000003 implements MigrationInterface {
    name = 'CreatePurchaseEnquiries1704100000003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE "purchase_enquiries" (
        "id" SERIAL NOT NULL,
        "farmer_id" integer NOT NULL,
        "intermediary_id" integer,
        "created_by_user_id" integer NOT NULL,
        "product_type" character varying(100) NOT NULL,
        "quantity" decimal(10,2) NOT NULL,
        "quantity_unit" character varying(20) NOT NULL DEFAULT 'kg',
        "expected_price" decimal(12,2) NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'CREATED',
        "payment_status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_purchase_enquiries" PRIMARY KEY ("id"),
        CONSTRAINT "FK_enquiries_farmer" FOREIGN KEY ("farmer_id") REFERENCES "farmers"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_enquiries_intermediary" FOREIGN KEY ("intermediary_id") REFERENCES "intermediaries"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_enquiries_created_by" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

        // Create indexes for common queries
        await queryRunner.query(`CREATE INDEX "IDX_enquiries_farmer" ON "purchase_enquiries" ("farmer_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_enquiries_intermediary" ON "purchase_enquiries" ("intermediary_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_enquiries_status" ON "purchase_enquiries" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_enquiries_created_by" ON "purchase_enquiries" ("created_by_user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_enquiries_created_by"`);
        await queryRunner.query(`DROP INDEX "IDX_enquiries_status"`);
        await queryRunner.query(`DROP INDEX "IDX_enquiries_intermediary"`);
        await queryRunner.query(`DROP INDEX "IDX_enquiries_farmer"`);
        await queryRunner.query(`DROP TABLE "purchase_enquiries"`);
    }
}
