import { getRepository, Like } from 'typeorm';

import { PurchaseEnquiry } from 'orm/entities/enquiries/PurchaseEnquiry';
import { EnquiryStatus, PaymentStatus } from 'orm/entities/users/types';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { PaginationOptions, PaginatedResponse } from 'types/Pagination';

export class EnquiryService {
    private get enquiryRepository() {
        return getRepository(PurchaseEnquiry);
    }

    async create(data: Partial<PurchaseEnquiry>) {
        const enquiry = this.enquiryRepository.create(data);
        return this.enquiryRepository.save(enquiry);
    }

    async list(filters: any = {}, options: PaginationOptions = {}): Promise<PaginatedResponse<PurchaseEnquiry>> {
        const defaultRelations = ['farmer', 'farmer.user', 'intermediary', 'intermediary.user', 'createdByUser'];

        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        let where: any = filters;

        // Simple search implementation
        if (options.search) {
            const search = `%${options.search}%`;
            // Searching product type or notes
            // Note: This overrides specific filters if not carefully merged, but valid for simple admin search
            // For stricter filtering + search, we'd need complex query builder. 
            // Simplified: If search is present, we only search productType for now OR match strict filters
            where = [
                { ...filters, productType: Like(search) },
                { ...filters, notes: Like(search) }
            ];
        }

        const [items, total] = await this.enquiryRepository.findAndCount({
            where,
            relations: defaultRelations,
            order: {
                [options.sort || 'createdAt']: options.order || 'DESC',
            },
            take: limit,
            skip,
        });

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const enquiry = await this.enquiryRepository.findOne({
            where: { id },
            relations: ['farmer', 'farmer.user', 'intermediary', 'intermediary.user', 'createdByUser'],
        });

        if (!enquiry) {
            throw new CustomError(404, 'General', 'Enquiry not found');
        }
        return enquiry;
    }

    async updateStatus(id: number, status: EnquiryStatus) {
        const enquiry = await this.findOne(id);
        enquiry.status = status;
        return this.enquiryRepository.save(enquiry);
    }

    async updatePaymentStatus(id: number, paymentStatus: PaymentStatus) {
        const enquiry = await this.findOne(id);
        enquiry.paymentStatus = paymentStatus;
        return this.enquiryRepository.save(enquiry);
    }

    async update(id: number, data: Partial<PurchaseEnquiry>) {
        const enquiry = await this.findOne(id);
        this.enquiryRepository.merge(enquiry, data);
        return this.enquiryRepository.save(enquiry);
    }

    async delete(id: number) {
        const enquiry = await this.findOne(id);
        return this.enquiryRepository.remove(enquiry);
    }
}
