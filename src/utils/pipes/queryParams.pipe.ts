import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { QueryParamsInterface } from 'src/utils/interfaces';

@Injectable()
export class QueryParamsValidationPipe implements PipeTransform {
  transform(value: QueryParamsInterface) {
    const { page, itemsPerPage, getAll } = value;

    if (page && isNaN(Number(page))) {
      throw new BadRequestException('Page must be a number');
    }
    if (itemsPerPage && isNaN(Number(itemsPerPage))) {
      throw new BadRequestException('Items per page must be a number');
    }

    return {
      page: page ? Number(page) : 1,
      itemsPerPage: itemsPerPage ? Number(itemsPerPage) : 10,
      getAll: getAll ? Boolean(getAll) : false,
    };
  }
}
