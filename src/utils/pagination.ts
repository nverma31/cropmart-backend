import { Request } from 'express';
import { PaginationOptions } from 'types/Pagination';

export const getPaginationOptions = (req: Request): PaginationOptions => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const sort = req.query.sort as string;
    const order = (req.query.order as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const search = req.query.search as string;

    return {
        page: isNaN(page) ? 1 : page,
        limit: isNaN(limit) ? 10 : limit,
        sort,
        order,
        search,
    };
};

export const getFilters = (req: Request): any => {
    const filters = { ...req.query };
    delete filters.page;
    delete filters.limit;
    delete filters.sort;
    delete filters.order;
    delete filters.search;
    return filters;
};
