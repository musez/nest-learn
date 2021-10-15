import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateCodeGenerateDto } from './dto/create-code-generate.dto';
import { UpdateCodeGenerateDto } from './dto/update-code-generate.dto';

@Injectable()
export class CodeGenerateService {
  private readonly logger = new Logger(CodeGenerateService.name);

  constructor(private readonly connection: Connection) {
    console.log(connection);
  }

  create(createCodeGenerateDto: CreateCodeGenerateDto) {
    return 'This action adds a new codeGenerate';
  }

  findAll() {
    return `This action returns all codeGenerate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codeGenerate`;
  }

  update(id: number, updateCodeGenerateDto: UpdateCodeGenerateDto) {
    return `This action updates a #${id} codeGenerate`;
  }

  remove(id: number) {
    return `This action removes a #${id} codeGenerate`;
  }
}
