import { getRepository, Like } from 'typeorm';

import { Intermediary } from 'orm/entities/intermediaries/Intermediary';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { PaginationOptions, PaginatedResponse } from 'types/Pagination';

export class IntermediaryService {
    private get intermediaryRepository() {
        return getRepository(Intermediary);
    }

    async list(filters: any = {}, options: PaginationOptions = {}): Promise<PaginatedResponse<Intermediary>> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        let where: any = filters;

        if (options.search) {
            const search = `%${options.search}%`;
            where = [
                { ...filters, businessName: Like(search) },
                { ...filters, user: { name: Like(search) } },
                { ...filters, user: { phone: Like(search) } }
            ];
        }

        const [items, total] = await this.intermediaryRepository.findAndCount({
            relations: ['user', 'farmers'],
            where,
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
        const intermediary = await this.intermediaryRepository.findOne({
            where: { id },
            relations: ['user', 'farmers', 'farmers.user'],
        });

        if (!intermediary) {
            throw new CustomError(404, 'General', 'Intermediary not found');
        }
        return intermediary;
    }

    async findByUserId(userId: number) {
        return this.intermediaryRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
    }

    async update(id: number, data: Partial<Intermediary>) {
        const intermediary = await this.findOne(id);
        this.intermediaryRepository.merge(intermediary, data);
        return this.intermediaryRepository.save(intermediary);
    }

    async getLinkedFarmers(intermediaryId: number) {
        const intermediary = await this.findOne(intermediaryId);
        return intermediary.farmers;
    }
}
