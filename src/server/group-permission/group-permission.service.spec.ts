import { Test, TestingModule } from '@nestjs/testing';
import { GroupPermissionService } from './group-permission.service';

describe('GroupPermissionService', () => {
  let service: GroupPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupPermissionService],
    }).compile();

    service = module.get<GroupPermissionService>(GroupPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
