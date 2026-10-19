import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class s3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            endpoint: this.configService.get<string>('AWS_ENDPOINT_URL_S3'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: true,
        });
        this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    }
    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `${uuid()}${extname(file.originalname)}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
        });

        await this.s3Client.send(command);
        return key; // Return the unique key for the uploaded file
    }

    async getFile(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.s3Client.send(command);
    }
    async generateUploadPresignedUrl(fileName: string, contentType: string): Promise<{ url: string; key: string }> {
        const key = `${uuid()}${extname(fileName)}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(this.s3Client, command, {
            expiresIn: 300, // 5 minutes
        });

        return { url, key };
    }


}
