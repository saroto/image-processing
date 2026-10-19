import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { ObjectStorageService } from 'src/configuration/object-storage.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadImageService {
  constructor(
    private readonly objectStorageService: ObjectStorageService,
    private readonly prismaService: PrismaService
  ) { }
  async uploadImage(userId: number, file: Buffer | Uint8Array | string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (userId === null || userId === undefined) {
      throw new BadRequestException('User ID is required');
    }
    if (typeof file === 'string') {
      throw new BadRequestException('File must be a Buffer or Uint8Array');
    }
    const fileName = `${Date.now()}-${file.values().next().value}`;
    await this.objectStorageService.uploadFile(fileName, file, "images");
    const imageRecord = await this.prismaService.image.create({
      data: {

        userId: userId,
        path: fileName,
      },
    });
    return imageRecord;
  }
} 
