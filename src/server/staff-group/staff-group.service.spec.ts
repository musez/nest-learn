import { Test, TestingModule } from '@nestjs/testing';
import { StaffGroupService } from './staff-group.service';

describe('StaffGroupService', () => {
  let service: StaffGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffGroupService],
    }).compile();

    service = module.get<StaffGroupService>(StaffGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
