import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Helpers } from '../helpers';
import { getEnvVariables } from 'src/config/configuration';
import { Admin, AdminJwt, Role, Permission } from 'src/models';
import { RequestInteface, AdminFormattedObject } from '../interfaces';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  private readonly JWT_SECRET: string;

  constructor(
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(AdminJwt) private readonly ADMIN_JWT: typeof AdminJwt,
    @InjectModel(Role) private readonly ROLE: typeof Role,
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    private readonly configService: ConfigService,
    private readonly helpers: Helpers,
  ) {
    ({ JWT_SECRET: this.JWT_SECRET } = getEnvVariables(configService));
  }

  async use(req: RequestInteface, res: Response, next: NextFunction): Promise<void> {
    const authHeader: string = req.headers['authorization'];

    if (!authHeader) {
      throw new HttpException({ success: false, message: 'Authorization header missing!' }, HttpStatus.NOT_FOUND);
    }

    const token: string = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException({ success: false, message: 'Token must be non-null!' }, HttpStatus.NOT_FOUND);
    }

    try {
      const decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        id: number;
        email: string;
      };

      const admin = await this.ADMIN.findByPk(decodedToken.id, {
        attributes: { exclude: ['password', 'created_at', 'updated_at'] },
        include: [
          {
            model: Role,
            attributes: ['type'],
            include: [
              {
                model: Permission,
                attributes: ['can'],
                through: { attributes: [] },
              },
            ],
            through: { attributes: [] },
          },
        ],
      });

      const formattedAdminObject: AdminFormattedObject = this.helpers.formatAdminObject(admin.toJSON());

      if (!admin) {
        throw new HttpException({ success: false, message: 'Admin not found!' }, HttpStatus.NOT_FOUND);
      }

      const isValid: AdminJwt = await this.ADMIN_JWT.findOne({ where: { token } });
      if (!isValid) {
        throw new HttpException({ success: false, message: 'Kindly login again!' }, HttpStatus.UNAUTHORIZED);
      }

      req.admin = formattedAdminObject;
      next();
    } catch (err) {
      await this.ADMIN_JWT.destroy({ where: { token } });

      this.helpers.handleException(err);
    }
  }
}
