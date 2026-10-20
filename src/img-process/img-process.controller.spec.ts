import { Test, TestingModule } from '@nestjs/testing';
import { ImgProcessController } from './img-process.controller';
import { ImgProcessService } from './img-process.service';

describe('ImgProcessController', () => {
  let controller: ImgProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImgProcessController],
      providers: [ImgProcessService],
    }).compile();

    controller = module.get<ImgProcessController>(ImgProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
