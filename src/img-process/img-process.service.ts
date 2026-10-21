import { Injectable } from '@nestjs/common';
import { s3Service } from 'src/configuration/s3.service';
import sharp from 'sharp';
import { ResizeDto } from './dto/resize.dto';
@Injectable()
export class ImgProcessService {
    constructor(private readonly s3Service: s3Service) { }

    async resizeImage(key: string, ResizeDto: ResizeDto) {
        const { width, height } = ResizeDto;
        const { buffer, contentType } = await this.s3Service.getFileBuffer(key);
        console.log('img', { buffer, contentType });
        // Use Sharp to resize the image
        const resizeImage = await sharp(buffer).rotate().resize(width, height).toBuffer();
        if (!resizeImage) {
            throw new Error('Image resizing failed');
        }

        return this.s3Service.uploadBuffer(resizeImage, `resized-${key}`, contentType);

    }

    async rotateImage(key: string, angle: number) {
        const { buffer, contentType } = await this.s3Service.getFileBuffer(key);
        const rotatedImage = await sharp(buffer).rotate(angle).toBuffer();
        if (!rotatedImage) {
            throw new Error('Image rotation failed');
        }

        return this.s3Service.uploadBuffer(rotatedImage, `rotated-${key}`, contentType);
    }

    async convertImageFormat(key: string, format: 'jpeg' | 'png' | 'webp') {
        const { buffer, contentType } = await this.s3Service.getFileBuffer(key);
        let convertedImage: Buffer;
        switch (format) {
            case 'jpeg':
                convertedImage = await sharp(buffer).jpeg().toBuffer();
                break;
            case 'png':
                convertedImage = await sharp(buffer).png().toBuffer();
                break;
            case 'webp':
                convertedImage = await sharp(buffer).webp().toBuffer();
                break;
            default:
                throw new Error('Unsupported format');
        }

        if (!convertedImage) {
            throw new Error('Image format conversion failed');
        }

        return this.s3Service.uploadBuffer(convertedImage, `converted-${key}`, format);
    }

}
