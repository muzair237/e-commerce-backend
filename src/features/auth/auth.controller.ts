import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/adminLogin-dto';
import { GeneralApiResponse, RequestInteface } from '../../utils/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginInfo: AdminLoginDto): Promise<GeneralApiResponse> {
    return await this.authService.adminLogin(loginInfo);
  }

  @Get('me')
  async me(@Request() req: RequestInteface): Promise<GeneralApiResponse> {
    return { success: true, message: 'Admin details retrieved successfully', data: { ...req?.admin } };
  }
  @Get('logout')
  async logoutAdmin(@Request() req: RequestInteface): Promise<GeneralApiResponse> {
    return await this.authService.logoutAdmin({ id: req.admin.id } as { id: number });
  }
}
