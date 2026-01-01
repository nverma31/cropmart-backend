import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Intermediary } from '../intermediaries/Intermediary';
import { User } from '../users/User';

@Entity('farmers')
export class Farmer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    intermediaryId: number | null;

    @ManyToOne(() => Intermediary, (intermediary) => intermediary.farmers, { nullable: true })
    @JoinColumn({ name: 'intermediary_id' })
    intermediary: Intermediary | null;

    // Profile fields
    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    district: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string | null;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pincode: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    landHolding: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
