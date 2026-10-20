import { Module } from '@nestjs/common';
import { ImgProcessService } from './img-process.service';
import { ImgProcessController } from './img-process.controller';

@Module({
  controllers: [ImgProcessController],
  providers: [ImgProcessService],
})
export class ImgProcessModule {}
