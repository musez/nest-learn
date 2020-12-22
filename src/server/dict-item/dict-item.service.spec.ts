import { Test, TestingModule } from '@nestjs/testing';
import { DictItemService } from './dict-item.service';

describe('DictItemService', () => {
  let service: DictItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictItemService],
    }).compile();

    service = module.get<DictItemService>(DictItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
