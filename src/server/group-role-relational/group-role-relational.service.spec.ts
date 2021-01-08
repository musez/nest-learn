import { Test, TestingModule } from '@nestjs/testing';
import { GroupRoleRelationalService } from './group-role-relational.service';

describe('GroupRoleRelationalService', () => {
  let service: GroupRoleRelationalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRoleRelationalService],
    }).compile();

    service = module.get<GroupRoleRelationalService>(GroupRoleRelationalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
