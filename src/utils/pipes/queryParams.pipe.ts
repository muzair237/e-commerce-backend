import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AfterQueryParamsInterface, BeforeQueryParamsInterface } from 'src/utils/interfaces';

@Injectable()
export class QueryParamsValidationPipe implements PipeTransform {
  transform(value: BeforeQueryParamsInterface): AfterQueryParamsInterface {
    const { page, itemsPerPage, getAll, searchText, startDate, endDate, sort, roleType } = value;

    if (page && isNaN(Number(page))) {
      throw new BadRequestException('Page must be a number');
    }
    if (itemsPerPage && isNaN(Number(itemsPerPage))) {
      throw new BadRequestException('Items per page must be a number');
    }
    if (startDate && isNaN(new Date(startDate).getTime())) {
      throw new BadRequestException('Start date must be a valid date');
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      throw new BadRequestException('End date must be a valid date');
    }
    if (sort && !['asc', 'desc', 'latest', 'earliest'].includes(sort)) {
      throw new BadRequestException('Sort must be one of: asc, desc, latest, earliest');
    }
    if (roleType && roleType !== 'all' && isNaN(Number(roleType))) {
      throw new BadRequestException('Role type must be a number or "all"');
    }

    return {
      page: Number(page) || 1,
      itemsPerPage: Number(itemsPerPage) || 10,
      getAll: getAll === 'false' ? false : Boolean(getAll),
      searchText: searchText?.trim(),
      startDate: startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null,
      endDate: endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null,
      sort: sort || 'desc',
      roleType: roleType === 'all' ? 'all' : Number(roleType),
    };
  }
}
