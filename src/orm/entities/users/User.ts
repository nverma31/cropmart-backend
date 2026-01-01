import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Role, Roles } from './types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    default: Roles.FARMER,
  })
  role: Role;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    unique: true,
  })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  email: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name: string | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  }

  checkIfPasswordMatch(unencryptedPassword: string): boolean {
    if (!this.password) {
      return false;
    }
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
