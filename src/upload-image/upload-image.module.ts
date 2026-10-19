import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { s3Service } from 'src/configuration/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService, s3Service, PrismaService],
  exports: [UploadImageService],
})
export class UploadImageModule { }
