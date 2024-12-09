import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class QueryParamsValidationPipe implements PipeTransform {
  transform(value: any) {
    const transformedValue = {
      ...value,
      page: value.page ? parseInt(value.page, 10) : undefined,
      itemsPerPage: value.itemsPerPage ? parseInt(value.itemsPerPage, 10) : undefined,
      getAll: value.getAll === 'true',
    };

    if (isNaN(transformedValue.page)) {
      throw new BadRequestException('Invalid page number');
    }
    if (isNaN(transformedValue.itemsPerPage)) {
      throw new BadRequestException('Invalid itemsPerPage value');
    }

    return transformedValue;
  }
}
