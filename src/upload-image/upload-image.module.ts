import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { ObjectStorageService } from 'src/configuration/object-storage.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService, ObjectStorageService, PrismaService],

})
export class UploadImageModule { }
