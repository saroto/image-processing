import { Module } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [ObjectStorageService],
    exports: [ObjectStorageService],
})
export class ConfigurationModule {

}
