import { Test, TestingModule } from '@nestjs/testing';
import { CodeGenerateController } from './code-generate.controller';
import { CodeGenerateService } from './code-generate.service';

describe('CodeGenerateController', () => {
  let controller: CodeGenerateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeGenerateController],
      providers: [CodeGenerateService],
    }).compile();

    controller = module.get<CodeGenerateController>(CodeGenerateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
