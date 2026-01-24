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
import { EnquiryStatus, EnquiryStatuses, PaymentStatus, PaymentStatuses } from '../users/types';
import { User } from '../users/User';

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

  @Column({ type: 'varchar', length: 100, nullable: true })
  kaInventoryEntry: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  kaLinkedId: string | null;

  @Column({ type: 'date', nullable: true })
  enquiryDate: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  product: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantityMt: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  ratePerMt: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cashDiscountPercentage: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bagPacking: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  financePercentage: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  gstPercentage: number | null;

  @Column({ type: 'integer', nullable: true })
  purchaseDays: number | null;

  @Column({ type: 'text', nullable: true })
  purchaseConditions: string | null;

  @Column({ type: 'text', nullable: true })
  paymentConditions: string | null;

  @Column({ type: 'text', nullable: true })
  qcParametersBuyer: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pickupLocation: string | null;

  @Column({ type: 'text', nullable: true })
  qcParametersFarmer: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
