import { Request, Response, NextFunction } from 'express';
import { getRepository, Like } from 'typeorm';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { getPaginationOptions, getFilters } from 'utils/pagination';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = getRepository(User);
  try {
    const paginationOptions = getPaginationOptions(req);
    const filters = getFilters(req);

    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit || 10;
    const skip = (page - 1) * limit;

    let where: any = filters;

    if (paginationOptions.search) {
      const search = `%${paginationOptions.search}%`;
      where = [
        { ...filters, name: Like(search) },
        { ...filters, email: Like(search) },
        { ...filters, phone: Like(search) },
        { ...filters, role: Like(search) }
      ];
    }

    const [items, total] = await userRepository.findAndCount({
      select: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt', 'updatedAt'],
      where,
      order: {
        [paginationOptions.sort || 'createdAt']: paginationOptions.order || 'DESC',
      },
      take: limit,
      skip,
    });

    const result = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    res.customSuccess(200, 'List of users.', result);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of users.`, null, err);
    return next(customError);
  }
};
