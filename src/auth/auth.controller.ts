import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')

  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('login')

  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }

  @Post('refresh')
  async refresh(@Body() token: string) {
    // console.log('refresh_token', token);
    return await this.authService.refreshToken(token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() accessToken: string) {
    return await this.authService.logout(accessToken);
  }

}
