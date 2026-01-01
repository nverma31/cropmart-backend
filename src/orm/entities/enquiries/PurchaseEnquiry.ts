import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Farmer } from '../farmers/Farmer';
import { Intermediary } from '../intermediaries/Intermediary';
import { User } from '../users/User';
import { EnquiryStatus, EnquiryStatuses, PaymentStatus, PaymentStatuses } from '../users/types';

@Entity('purchase_enquiries')
export class PurchaseEnquiry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    farmerId: number;

    @ManyToOne(() => Farmer)
    @JoinColumn({ name: 'farmer_id' })
    farmer: Farmer;

    @Column({ nullable: true })
    intermediaryId: number | null;

    @ManyToOne(() => Intermediary, { nullable: true })
    @JoinColumn({ name: 'intermediary_id' })
    intermediary: Intermediary | null;

    @Column()
    createdByUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by_user_id' })
    createdByUser: User;

    @Column({ type: 'varchar', length: 100 })
    productType: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'varchar', length: 20, default: 'kg' })
    quantityUnit: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    expectedPrice: number;

    @Column({
        type: 'varchar',
        length: 20,
        default: EnquiryStatuses.CREATED,
    })
    status: EnquiryStatus;

    @Column({
        type: 'varchar',
        length: 20,
        default: PaymentStatuses.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
