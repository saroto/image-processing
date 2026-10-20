import { Test, TestingModule } from '@nestjs/testing';
import { ImgProcessService } from './img-process.service';

describe('ImgProcessService', () => {
  let service: ImgProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImgProcessService],
    }).compile();

    service = module.get<ImgProcessService>(ImgProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
