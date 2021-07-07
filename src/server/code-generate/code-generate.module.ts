import { Module } from '@nestjs/common';
import { CodeGenerateService } from './code-generate.service';
import { CodeGenerateController } from './code-generate.controller';

@Module({
  controllers: [CodeGenerateController],
  providers: [CodeGenerateService]
})
export class CodeGenerateModule {}
