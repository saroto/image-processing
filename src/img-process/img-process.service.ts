import { Injectable } from '@nestjs/common';
import { s3Service } from 'src/configuration/s3.service';
import { sharp } from 'sharp';
import { ResizeDto } from './dto/resize.dto';
@Injectable()
export class ImgProcessService {
    constructor(private readonly s3Service: s3Service) { }

    async resizeImage(key: string, ResizeDto: ResizeDto) {
        const { width, height } = ResizeDto;
        const img = await this.s3Service.getFile(key);
    }

}
