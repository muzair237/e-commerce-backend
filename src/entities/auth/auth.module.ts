import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Role, Permission } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Admin, AdminJwt, Role, Permission])],
  controllers: [AuthController],
  providers: [AuthService, Helpers],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthAdminMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.POST })
      .forRoutes(AuthController);
  }
}
