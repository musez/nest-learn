import { Test, TestingModule } from '@nestjs/testing';
import { ArticleDataCatController } from './article-data-cat.controller';
import { ArticleDataCatService } from './article-data-cat.service';

describe('ArticleDataCatController', () => {
  let controller: ArticleDataCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleDataCatController],
      providers: [ArticleDataCatService],
    }).compile();

    controller = module.get<ArticleDataCatController>(ArticleDataCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
