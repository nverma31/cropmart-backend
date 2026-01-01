import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { Roles } from '../entities/users/types';
import { User } from '../entities/users/User';

export class SeedAdminUser1704100000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(User);

        // Create admin user
        const admin = new User();
        admin.email = 'admin@cropmart.com';
        admin.password = 'admin123';
        admin.hashPassword();
        admin.name = 'Cropmart Admin';
        admin.role = Roles.ADMIN;
        admin.isActive = true;
        await userRepository.save(admin);

        console.log('Admin user created: admin@cropmart.com / admin123');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "users" WHERE email = 'admin@cropmart.com'`);
    }
}
