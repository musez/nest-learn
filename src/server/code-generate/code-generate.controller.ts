import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CodeGenerateService } from './code-generate.service';
import { CreateCodeGenerateDto } from './dto/create-code-generate.dto';
import { UpdateCodeGenerateDto } from './dto/update-code-generate.dto';

@Controller('code-generate')
export class CodeGenerateController {
  constructor(private readonly codeGenerateService: CodeGenerateService) {}

  @Post()
  create(@Body() createCodeGenerateDto: CreateCodeGenerateDto) {
    return this.codeGenerateService.create(createCodeGenerateDto);
  }

  @Get()
  findAll() {
    return this.codeGenerateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeGenerateService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCodeGenerateDto: UpdateCodeGenerateDto,
  ) {
    return this.codeGenerateService.update(+id, updateCodeGenerateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codeGenerateService.remove(+id);
  }
}
