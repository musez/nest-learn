import { Test, TestingModule } from '@nestjs/testing';
import { HolidayCatService } from './holiday-cat.service';

describe('HolidayCatService', () => {
  let service: HolidayCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HolidayCatService],
    }).compile();

    service = module.get<HolidayCatService>(HolidayCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
