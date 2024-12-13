import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/adminLogin-dto';
import { RequestInteface } from '../../utils/types/request.interface';

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
}
