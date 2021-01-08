import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionRelationalService } from './role-permission-relational.service';

describe('RolePermissionRelationalService', () => {
  let service: RolePermissionRelationalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolePermissionRelationalService],
    }).compile();

    service = module.get<RolePermissionRelationalService>(RolePermissionRelationalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
