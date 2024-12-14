import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminData, AdminFormattedObject, PaginationResult } from './interfaces';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { getEnvVariables } from 'src/config/configuration';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable()
export class Helpers {
  private readonly JWT_SECRET: string;
  constructor(private readonly configService: ConfigService) {
    ({ JWT_SECRET: this.JWT_SECRET } = getEnvVariables(configService));
  }

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

  hashPassword = (password: string): string => {
    const salt: string = bcryptjs.genSaltSync(10);
    const passwordHashed: string = bcryptjs.hashSync(password, salt);
    return passwordHashed;
  };

  comparePassword = (password: string, hasedPassword: string): boolean => bcryptjs.compareSync(password, hasedPassword);

  generateJWTToken = (payload: { id: number; email: string }): string =>
    jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '2d',
      algorithm: 'HS256',
    });

  decryptToken = (
    token: string,
  ): {
    iat: Date;
    exp: Date;
  } => {
    const decrypted: JwtPayload = jwtDecode<JwtPayload>(token);
    const iat = decrypted.iat ? new Date(decrypted.iat * 1000) : null;
    const exp = decrypted.exp ? new Date(decrypted.exp * 1000) : null;

    if (!iat || !exp) {
      throw new HttpException('Invalid token payload: Missing `iat` or `exp`', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { iat, exp };
  };

  formatAdminObject = (adminData: AdminData): AdminFormattedObject => {
    const roles: string[] = [];
    const permissions: string[] = [];

    adminData.roles.forEach(role => {
      roles.push(role.type);

      role.permissions.forEach(permission => {
        if (!permissions.includes(permission.can)) {
          permissions.push(permission.can);
        }
      });
    });

    return {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      roles,
      permissions,
    };
  };

  handleException = (err: any) => {
    if (err instanceof HttpException) {
      throw err;
    }

    throw new HttpException(
      {
        success: false,
        message: err.message || 'Internal server error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
