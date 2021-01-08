import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupRelationalController } from './user-group-relational.controller';
import { UserGroupRelationalService } from './user-group-relational.service';

describe('UserGroupRelationalController', () => {
  let controller: UserGroupRelationalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupRelationalController],
      providers: [UserGroupRelationalService],
    }).compile();

    controller = module.get<UserGroupRelationalController>(UserGroupRelationalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
