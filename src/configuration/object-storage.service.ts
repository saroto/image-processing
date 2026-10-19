import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ObjectStorageService {
    private s3Client: S3Client;
    private bucketName: string;
    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
        this.s3Client = new S3Client({
            endpoint: this.configService.get<string>('AWS_ENDPOINT_URL_S3'),
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: true,
        });
    }

    async uploadFile(key: string, body: Buffer | Uint8Array | string, contentType: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        const response = await this.s3Client.send(command);
        return response;
    }
}
