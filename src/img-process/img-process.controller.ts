import { Controller } from '@nestjs/common';
import { ImgProcessService } from './img-process.service';

@Controller('img-process')
export class ImgProcessController {
  constructor(private readonly imgProcessService: ImgProcessService) {}
}
