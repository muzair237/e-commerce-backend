import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt } from 'src/models';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [SequelizeModule.forFeature([Admin, AdminJwt])],
  controllers: [AuthController],
  providers: [AuthService, Helpers],
})
export class AuthModule {}
