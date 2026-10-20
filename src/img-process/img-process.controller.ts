import { Body, Controller, Param, Post } from '@nestjs/common';
import { ImgProcessService } from './img-process.service';
import { ResizeDto } from './dto/resize.dto';
@Controller('img-process')
export class ImgProcessController {
  constructor(private readonly imgProcessService: ImgProcessService) { }
  @Post('resize/:key')
  async resizeImage(@Param('key') key: string, @Body() ResizeDto: ResizeDto) {
    return await this.imgProcessService.resizeImage(key, ResizeDto);
  }
}
