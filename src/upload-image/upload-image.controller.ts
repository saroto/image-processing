import { Controller, Get, Post, Query, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('upload-image')
@ApiBasicAuth('bearer')
@UseInterceptors(FileInterceptor('file'))
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) { }

  @Post(":user_id")

  async uploadImage(@Param("user_id", ParseIntPipe) userId, @UploadedFile("file") file: Express.Multer.File) {
    console.log('userId', userId);
    return await this.uploadImageService.uploadImage(file, userId);
  }
  @Get("download")
  async getImage(@Query("key") key: string) {
    return await this.uploadImageService.download(key);
  }
  @Get("get-image")
  async getPresignedUrl(@Query("filename") fileName: string, @Query("content_type") contentType: string) {
    return await this.uploadImageService.getImageUrl(fileName, contentType);
  }
}
