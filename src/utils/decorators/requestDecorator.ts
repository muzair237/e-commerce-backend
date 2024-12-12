import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { QueryParamsValidationPipe } from '../pipes/queryParams.pipe';
import { QueryParamsInterface } from '../interfaces';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FileValidationPipe } from '../pipes/file.pipe';

export const RequestDecorator = createParamDecorator(
  async (dto: new (...args: any[]) => object, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const query = req.query;
    if (query && Object.keys(query).length > 0) {
      const pipe = new QueryParamsValidationPipe();
      const validationResult: QueryParamsInterface = pipe.transform(query);

      req.query = { ...req.query, ...validationResult } as any;
    }

    const body = req.body;
    if (dto && (!body || Object.keys(body).length === 0)) {
      throw new BadRequestException('Request body is required but missing');
    }

    if (body && Object.keys(body).length > 0) {
      const dtoInstance = plainToInstance(dto, body);
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        throw new BadRequestException('Payload validation failed');
      }

      req.body = dtoInstance;
    }

    const file = req.file;
    if (file) {
      const fileValidationPipe = new FileValidationPipe();
      req.file = await fileValidationPipe.transform(file);
    }

    return req;
  },
);
