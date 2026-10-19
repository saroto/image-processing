import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClearAccess } from './auth/clearAccess';
import { UploadImageModule } from './upload-image/upload-image.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { s3Service } from './configuration/s3.service';


@Module({
  imports: [UserModule, ImageModule, AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), UploadImageModule, ConfigModule, ConfigurationModule],
  controllers: [AppController],
  providers: [AppService, ClearAccess, s3Service],
})
export class AppModule { }
