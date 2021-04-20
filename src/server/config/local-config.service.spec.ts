import { Test, TestingModule } from '@nestjs/testing';
import { LocalConfigService } from './local-config.service';

describe('ConfigService', () => {
  let service: LocalConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalConfigService],
    }).compile();

    service = module.get<LocalConfigService>(LocalConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
