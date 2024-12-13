import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Helpers } from '../helpers';
import { getEnvVariables } from 'src/config/configuration';
import { Admin, AdminJwt } from 'src/models';
import { RequestInteface } from '../types/request.interface';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  private readonly JWT_SECRET: string;

  constructor(
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(AdminJwt) private readonly ADMIN_JWT: typeof AdminJwt,
    private readonly configService: ConfigService,
    private readonly helpers: Helpers,
  ) {
    ({ JWT_SECRET: this.JWT_SECRET } = getEnvVariables(configService));
  }

  async use(req: RequestInteface, res: Response, next: NextFunction): Promise<void> {
    const authHeader: string = req.headers['authorization'];

    if (!authHeader) {
      throw new HttpException({ success: false, message: 'Authorization header missing!' }, HttpStatus.UNAUTHORIZED);
    }

    const token: string = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException({ success: false, message: 'Token must be non-null!' }, HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        id: number;
        email: string;
      };

      const admin: Admin = await this.ADMIN.findByPk(decodedToken.id, {
        attributes: { exclude: ['password', 'created_at', 'updated_at'] },
        raw: true,
      });

      if (!admin) {
        throw new HttpException({ success: false, message: 'Unauthorized!' }, HttpStatus.UNAUTHORIZED);
      }

      const isValid: AdminJwt = await this.ADMIN_JWT.findOne({ where: { token } });
      if (!isValid) {
        throw new HttpException({ success: false, message: 'Kindly login again!' }, HttpStatus.UNAUTHORIZED);
      }

      req.admin = admin;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        await this.ADMIN_JWT.destroy({ where: { token } });
        throw new HttpException(
          {
            success: false,
            message: `${err.name}: ${err.message}`,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      this.helpers.handleException(err);
    }
  }
}
