import { Test, TestingModule } from '@nestjs/testing';
import { DictItemController } from './dict-item.controller';
import { DictItemService } from './dict-item.service';

describe('DictItemController', () => {
  let controller: DictItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictItemController],
      providers: [DictItemService],
    }).compile();

    controller = module.get<DictItemController>(DictItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
