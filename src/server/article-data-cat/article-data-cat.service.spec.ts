import { Test, TestingModule } from '@nestjs/testing';
import { ArticleDataCatService } from './article-data-cat.service';

describe('ArticleDataCatService', () => {
  let service: ArticleDataCatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleDataCatService],
    }).compile();

    service = module.get<ArticleDataCatService>(ArticleDataCatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
