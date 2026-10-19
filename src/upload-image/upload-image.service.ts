import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { s3Service } from 'src/configuration/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadImageService {
  constructor(
    private readonly objectStorageService: s3Service,
    private readonly prismaService: PrismaService
  ) { }
  async uploadImage(file: Express.Multer.File, user_id: number) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!user_id) {
      throw new BadRequestException('No user_id provided');
    }
    const fileUrl = await this.objectStorageService.uploadFile(file);
    const imageRecord = await this.prismaService.image.create({
      data: {
        userId: user_id,
        path: fileUrl,
      },
    });
    return imageRecord;
  }

  async download(key: string) {
    const fileStream = await this.objectStorageService.getFile(key);
    return fileStream;
  }

  async getImageUrl(fileName: string, contentType: string) {
    const { url, key } = await this.objectStorageService.generateUploadPresignedUrl(fileName, contentType);
    return { url, key };
  }

} 
