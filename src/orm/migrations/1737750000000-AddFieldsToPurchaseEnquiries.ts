import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldsToPurchaseEnquiries1737750000000 implements MigrationInterface {
  name = 'AddFieldsToPurchaseEnquiries1737750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "ka_inventory_entry" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "ka_linked_id" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "enquiry_date" date`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "location" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "state" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "product" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "quantity_mt" decimal(10,2)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "rate_per_mt" decimal(12,2)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "cash_discount_percentage" decimal(5,2)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "bag_packing" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "finance_percentage" decimal(5,2)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "gst_percentage" decimal(5,2)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "purchase_days" integer`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "purchase_conditions" text`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "payment_conditions" text`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "qc_parameters_buyer" text`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "pickup_location" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" ADD "qc_parameters_farmer" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "qc_parameters_farmer"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "pickup_location"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "qc_parameters_buyer"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "payment_conditions"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "purchase_conditions"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "purchase_days"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "gst_percentage"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "finance_percentage"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "bag_packing"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "cash_discount_percentage"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "rate_per_mt"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "quantity_mt"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "product"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "enquiry_date"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "ka_linked_id"`);
    await queryRunner.query(`ALTER TABLE "purchase_enquiries" DROP COLUMN "ka_inventory_entry"`);
  }
}
