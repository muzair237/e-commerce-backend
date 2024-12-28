import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Helpers } from 'src/utils/helpers';
import { Admin, AdminJwt, AdminRole, Brand, Permission, Role } from 'src/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Admin, AdminJwt, Brand, Role, Permission, AdminRole])],
  controllers: [AdminsController],
  providers: [AdminsService, Helpers],
})
export class AdminsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(AdminsController);
  }
}
