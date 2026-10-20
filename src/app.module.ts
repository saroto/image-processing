import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClearAccess } from './auth/clearAccess';
import { UploadImageModule } from './upload-image/upload-image.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { s3Service } from './configuration/s3.service';
import { ImgProcessModule } from './img-process/img-process.module';


@Module({
  imports: [UserModule, AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), UploadImageModule, ConfigModule, ConfigurationModule, ImgProcessModule],
  controllers: [AppController],
  providers: [AppService, ClearAccess, s3Service],
})
export class AppModule { }
