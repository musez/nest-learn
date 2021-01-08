import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionRelationalController } from './role-permission-relational.controller';
import { RolePermissionRelationalService } from './role-permission-relational.service';

describe('RolePermissionRelationalController', () => {
  let controller: RolePermissionRelationalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionRelationalController],
      providers: [RolePermissionRelationalService],
    }).compile();

    controller = module.get<RolePermissionRelationalController>(RolePermissionRelationalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
