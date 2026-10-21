import { Body, Controller, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImgProcessService } from './img-process.service';
import { ResizeDto } from './dto/resize.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ApiBasicAuth } from '@nestjs/swagger';
import { TransformInterceptor } from 'src/interceptor/transform.interceptor';
@Controller('img-process')
@UseGuards(JwtAuthGuard)
@ApiBasicAuth('bearer')
@UseInterceptors(TransformInterceptor)
export class ImgProcessController {
  constructor(private readonly imgProcessService: ImgProcessService) { }
  @Post('resize/:key')
  async resizeImage(@Param('key') key: string, @Body() ResizeDto: ResizeDto) {
    return await this.imgProcessService.resizeImage(key, ResizeDto);
  }
  @Post('rotate/:key/:angle')
  async rotateImage(@Param('key') key: string, @Param('angle') angle: number) {
    return await this.imgProcessService.rotateImage(key, angle);
  }
  @Post('convert/:key/:format')
  async convertImageFormat(@Param('key') key: string, @Param('format') format: 'jpeg' | 'png' | 'webp') {
    return await this.imgProcessService.convertImageFormat(key, format);
  }

}
