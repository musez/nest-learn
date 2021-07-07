import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeGenerateDto } from './create-code-generate.dto';

export class UpdateCodeGenerateDto extends PartialType(CreateCodeGenerateDto) {}
