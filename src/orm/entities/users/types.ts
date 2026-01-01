// User Roles
export type Role = 'FARMER' | 'INTERMEDIARY' | 'ADMIN';

export const Roles = {
    FARMER: 'FARMER' as Role,
    INTERMEDIARY: 'INTERMEDIARY' as Role,
    ADMIN: 'ADMIN' as Role,
};

// Purchase Enquiry Status
export type EnquiryStatus = 'CREATED' | 'IN_PROGRESS' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export const EnquiryStatuses = {
    CREATED: 'CREATED' as EnquiryStatus,
    IN_PROGRESS: 'IN_PROGRESS' as EnquiryStatus,
    CONFIRMED: 'CONFIRMED' as EnquiryStatus,
    COMPLETED: 'COMPLETED' as EnquiryStatus,
    CANCELLED: 'CANCELLED' as EnquiryStatus,
};

// Payment Status
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export const PaymentStatuses = {
    PENDING: 'PENDING' as PaymentStatus,
    PARTIAL: 'PARTIAL' as PaymentStatus,
    PAID: 'PAID' as PaymentStatus,
};
