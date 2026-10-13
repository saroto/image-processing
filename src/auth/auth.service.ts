import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { ResponseAuthDto } from './dto/response.dto';
import { hashPassword, comparePassword } from 'src/utils/hashPassword';
interface jwtPayload {
  username: string;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  async register(registerAuthDto: RegisterAuthDto) {
    const hashedPassword = await hashPassword(registerAuthDto.password);

    try {
      const user = await this.userService.create({
        ...registerAuthDto,
        password: hashedPassword,
      });
      if (!user) {
        throw new Error('User creation failed');
      }
      const accessToken = await this.generateAccessToken({ username: user.username, email: user.email });
      const refreshToken = await this.generateRefreshToken();
      const response: ResponseAuthDto = {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token: accessToken,
        refresh_token: refreshToken,
      }
      return response;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
  async generateAccessToken(payload: { username: string; email: string }) {


    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1h') as any,
    });
  }

  async generateRefreshToken() {
    return this.jwtService.signAsync({}, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByEmail(loginAuthDto.email);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await comparePassword(loginAuthDto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    // Here you would typically validate the password, omitted for brevity

    const accessToken = await this.generateAccessToken({ username: user.username, email: user.email });
    const refreshToken = await this.generateRefreshToken();
    const response: ResponseAuthDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
    return response;
  }
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      console.log('refresh_token_payload', payload);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new Error('User not found');
      }
      const accessToken = await this.generateAccessToken({ username: user.username, email: user.email });
      const refreshToken = await this.generateRefreshToken();
      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    })
  }



  async logout(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
