import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupRelationalService } from './user-group-relational.service';

describe('UserGroupRelationalService', () => {
  let service: UserGroupRelationalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGroupRelationalService],
    }).compile();

    service = module.get<UserGroupRelationalService>(UserGroupRelationalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
