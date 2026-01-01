import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Roles } from '../entities/users/types';
import { User } from '../entities/users/User';

export class SeedUsers1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // This seed is deprecated - the old Breaking Bad users are no longer needed
    // Admin user is now created by SeedAdminUser migration
    console.log('Legacy SeedUsers migration - skipped (deprecated)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}
