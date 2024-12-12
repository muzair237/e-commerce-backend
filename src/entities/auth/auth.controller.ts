import { Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { Request, Response } from 'express';
import { RequestDecorator } from 'src/utils/decorators/requestDecorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  adminLogin(@RequestDecorator(LoginDto) req: Request, @Res() res: Response) {
    return this.authService.adminLogin(req, res);
  }
}
