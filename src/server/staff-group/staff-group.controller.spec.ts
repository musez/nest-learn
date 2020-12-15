import { Test, TestingModule } from '@nestjs/testing';
import { StaffGroupController } from './staff-group.controller';
import { StaffGroupService } from './staff-group.service';

describe('StaffGroupController', () => {
  let controller: StaffGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffGroupController],
      providers: [StaffGroupService],
    }).compile();

    controller = module.get<StaffGroupController>(StaffGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
