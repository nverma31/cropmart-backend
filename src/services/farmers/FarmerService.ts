import { getRepository, Like } from 'typeorm';

import { Farmer } from 'orm/entities/farmers/Farmer';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { PaginationOptions, PaginatedResponse } from 'types/Pagination';

export class FarmerService {
    private get farmerRepository() {
        return getRepository(Farmer);
    }

    async list(filters: any = {}, options: PaginationOptions = {}): Promise<PaginatedResponse<Farmer>> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        let where: any = filters;

        if (options.search) {
            const search = `%${options.search}%`;
            // Search by User name or phone, or Farmer details (e.g. district)
            where = [
                { ...filters, user: { name: Like(search) } },
                { ...filters, user: { phone: Like(search) } },
                { ...filters, district: Like(search) }
            ];
        }

        const [items, total] = await this.farmerRepository.findAndCount({
            relations: ['user', 'intermediary', 'intermediary.user'],
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
        const farmer = await this.farmerRepository.findOne({
            where: { id },
            relations: ['user', 'intermediary', 'intermediary.user'],
        });

        if (!farmer) {
            throw new CustomError(404, 'General', 'Farmer not found');
        }
        return farmer;
    }

    async findByUserId(userId: number) {
        return this.farmerRepository.findOne({
            where: { userId },
            relations: ['user', 'intermediary'],
        });
    }

    async update(id: number, data: Partial<Farmer>) {
        const farmer = await this.findOne(id);
        this.farmerRepository.merge(farmer, data);
        return this.farmerRepository.save(farmer);
    }

    // Link farmer to an intermediary
    async linkIntermediary(farmerId: number, intermediaryId: number) {
        const farmer = await this.findOne(farmerId);
        farmer.intermediaryId = intermediaryId;
        return this.farmerRepository.save(farmer);
    }
}
