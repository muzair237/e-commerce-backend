import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Admin, AdminJwt } from 'src/models';
import { InjectModel } from '@nestjs/sequelize';
import { Helpers } from 'src/utils/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(AdminJwt) private readonly ADMIN_JWT: typeof AdminJwt,
    private readonly helpers: Helpers,
  ) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const admin = await this.ADMIN.findOne({ where: { email }, raw: true });
      if (!admin || !this.helpers.comparePassword(password, admin?.password)) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Incorrect email or password!' });
      }

      delete admin.password;

      const token = this.helpers.generateJWTToken({ id: admin?.id, email });
      const { iat, exp } = this.helpers.decryptToken(token);
      await this.ADMIN_JWT.upsert(
        {
          admin_id: admin?.id,
          token,
          iat,
          exp,
        },
        {
          conflictFields: ['admin_id'],
        },
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logged in successfully!',
        token,
      });
    } catch (err) {
      throw new HttpException({ success: false, message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
