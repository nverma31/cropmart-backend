import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import { Farmer } from '../farmers/Farmer';
import { User } from '../users/User';

@Entity('intermediaries')
export class Intermediary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Farmer, (farmer) => farmer.intermediary)
    farmers: Farmer[];

    // Business fields
    @Column({ type: 'varchar', length: 200, nullable: true })
    businessName: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    businessType: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    gstNumber: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    district: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pincode: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
