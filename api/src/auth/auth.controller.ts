import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  email?: string;
  username?: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const loginValue = String(dto.email ?? dto.username ?? '').trim();
    const password = String(dto.password ?? '').trim();

    if (!loginValue || !password) {
      throw new Error('Login and password are required');
    }

    return this.authService.login(loginValue, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: Request & { user?: { sub: number } }) {
    if (!request.user?.sub) {
      return null;
    }

    return this.authService.getCurrentUser(request.user.sub);
  }
}
