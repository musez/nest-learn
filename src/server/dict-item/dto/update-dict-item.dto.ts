import { PartialType } from '@nestjs/mapped-types';
import { CreateDictItemDto } from './create-dict-item.dto';

export class UpdateDictItemDto extends PartialType(CreateDictItemDto) {}
