import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UseInterceptors(TransformInterceptor)
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('login')
  @UseInterceptors(TransformInterceptor)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }

  @Post('refresh')
  @UseInterceptors(TransformInterceptor)
  async refresh(@Body() refreshTokenDto: string) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

}
