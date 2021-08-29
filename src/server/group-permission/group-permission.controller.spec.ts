import { Test, TestingModule } from '@nestjs/testing';
import { GroupPermissionController } from './group-permission.controller';
import { GroupPermissionService } from './group-permission.service';

describe('GroupPermissionController', () => {
  let controller: GroupPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupPermissionController],
      providers: [GroupPermissionService],
    }).compile();

    controller = module.get<GroupPermissionController>(GroupPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
