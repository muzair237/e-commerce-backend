import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/adminLogin-dto';
import { RequestInteface } from '../../utils/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginInfo: AdminLoginDto) {
    return await this.authService.adminLogin(loginInfo);
  }

  @Get('me')
  async me(@Request() req: RequestInteface) {
    return { success: true, message: 'Admin details retrieved successfully', data: { ...req?.admin } };
  }
  @Get('logout')
  async logoutAdmin(@Request() req: RequestInteface) {
    return await this.authService.logoutAdmin({ id: req.admin.id } as { id: number });
  }
}
