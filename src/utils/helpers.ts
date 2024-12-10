import { Injectable } from '@nestjs/common';
import { PaginationResult } from './interfaces';

@Injectable()
export class Helpers {
  pagination = (
    items: any[] = [],
    page: number = 1,
    totalItems: number = 0,
    itemsPerPage: number = 10,
    getAll: boolean = false,
  ): PaginationResult => {
    return {
      items,
      currentPage: page,
      hasNextPage: getAll ? false : itemsPerPage * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / itemsPerPage),
      totalItems,
    };
  };
}
