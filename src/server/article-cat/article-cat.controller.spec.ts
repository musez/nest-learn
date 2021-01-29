import { Test, TestingModule } from '@nestjs/testing';
import { ArticleCatController } from './article-cat.controller';
import { ArticleCatService } from './article-cat.service';

describe('ArticleCatController', () => {
  let controller: ArticleCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleCatController],
      providers: [ArticleCatService],
    }).compile();

    controller = module.get<ArticleCatController>(ArticleCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
