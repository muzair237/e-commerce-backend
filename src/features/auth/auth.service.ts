import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Admin, AdminJwt } from 'src/models';
import { InjectModel } from '@nestjs/sequelize';
import { Helpers } from 'src/utils/helpers';
import { AdminLoginDto } from './dto/adminLogin-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(AdminJwt) private readonly ADMIN_JWT: typeof AdminJwt,
    private readonly helpers: Helpers,
  ) {}

  async adminLogin(loginInfo: AdminLoginDto) {
    const { email, password } = loginInfo;

    try {
      const admin = await this.ADMIN.findOne({ where: { email }, raw: true });

      if (!admin || !this.helpers.comparePassword(password, admin?.password)) {
        throw new HttpException('Invalid login credentials!', HttpStatus.UNAUTHORIZED);
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

      return {
        success: true,
        message: 'Logged in successfully!',
        token,
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async logoutAdmin({ id }: { id: number }) {
    try {
      await this.ADMIN_JWT.destroy({ where: { admin_id: id } });
      return { success: true, message: 'Logged Out Successfully!' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
