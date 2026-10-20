import { Module } from '@nestjs/common';
import { ImgProcessService } from './img-process.service';
import { ImgProcessController } from './img-process.controller';
import { s3Service } from 'src/configuration/s3.service';

@Module({
  controllers: [ImgProcessController],
  providers: [ImgProcessService, s3Service],
})
export class ImgProcessModule { }
