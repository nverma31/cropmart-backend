import bcrypt from 'bcryptjs';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('otp_tokens')
export class OtpToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'varchar', length: 100 })
    otp: string; // Stored hashed

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    isUsed: boolean;

    @CreateDateColumn()
    createdAt: Date;

    hashOtp() {
        this.otp = bcrypt.hashSync(this.otp, 8);
    }

    checkIfOtpMatch(plainOtp: string): boolean {
        return bcrypt.compareSync(plainOtp, this.otp);
    }
}
