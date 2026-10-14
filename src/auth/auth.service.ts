import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { ResponseAuthDto } from './dto/response.dto';
import { hashPassword, comparePassword, hashToken } from 'src/utils/hashPassword';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
interface jwtPayload {
  username: string;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
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
      const { rawToken, hashedToken, expiresIn } = await this.generateRefreshToken();
      await this.saveRefreshToken(user.id, hashedToken, expiresIn);
      const response: ResponseAuthDto = {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token: accessToken,
        refresh_token: rawToken,
      }
      return response;
    } catch (error) {
      throw new Error('Error creating user');
    }
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
    const { rawToken: refreshToken, hashedToken, expiresIn } = await this.generateRefreshToken();
    await this.saveRefreshToken(user.id, hashedToken, expiresIn);
    const response: ResponseAuthDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
    return response;
  }

  async generateAccessToken(payload: { username: string; email: string }) {

    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
    });
  }

  async generateRefreshToken() {
    const rawToken = await crypto.randomBytes(48).toString('base64');
    const expiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const hashedToken = await hashToken(rawToken);

    return {
      rawToken,
      hashedToken,
      expiresIn,
    }
  }

  async saveRefreshToken(userId: number, hashedToken: string, expiresIn: number) {
    await this.prismaService.refreshToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt: new Date(expiresIn),
      },
    });
  }

  async refreshToken(token: string) {
    const hashedToken = await hashToken(token);
    const refreshTokenRecord = await this.prismaService.refreshToken.findUniqueOrThrow({
      where: {
        token: hashedToken,
      },
      include: {
        user: true,
      },
    });

    if (!refreshTokenRecord) {
      throw new NotFoundException('Refresh token not found');
    }

    if (refreshTokenRecord.isRevoked) {
      throw new BadRequestException('Refresh token revoked');
    }

    if (refreshTokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Refresh token expired');
    }
    await this.prismaService.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { isRevoked: true, expiresAt: new Date() }, // Revoke the old refresh token
    })
    const accessToken = await this.generateAccessToken({ username: refreshTokenRecord.user.username, email: refreshTokenRecord.user.email });
    const { rawToken: newRefreshToken, hashedToken: newHashedToken, expiresIn } = await this.generateRefreshToken();
    await this.saveRefreshToken(refreshTokenRecord.userId, newHashedToken, expiresIn);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    })
  }

  async revokeAllRefreshTokens(userId: number) {
    await this.prismaService.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, expiresAt: new Date() },
    });
  }

  async logout(userId: number) {
    await this.revokeAllRefreshTokens(userId);
    return { message: 'Logged out successfully' };
  }
}
