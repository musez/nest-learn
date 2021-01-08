import { Test, TestingModule } from '@nestjs/testing';
import { GroupRoleRelationalController } from './group-role-relational.controller';
import { GroupRoleRelationalService } from './group-role-relational.service';

describe('GroupRoleRelationalController', () => {
  let controller: GroupRoleRelationalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRoleRelationalController],
      providers: [GroupRoleRelationalService],
    }).compile();

    controller = module.get<GroupRoleRelationalController>(GroupRoleRelationalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
