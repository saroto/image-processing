import { Module } from '@nestjs/common';
import { s3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [s3Service],
    exports: [s3Service],
})
export class ConfigurationModule {

}
