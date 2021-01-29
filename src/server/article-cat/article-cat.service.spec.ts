import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCatService } from './article-cat.service';

describe('ArticleCatService', () => {
  let service: ArticleCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleCatService],
    }).compile();

    service = module.get<ArticleCatService>(ArticleCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
