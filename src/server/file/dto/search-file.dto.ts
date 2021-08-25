import {
  PickType,
} from '@nestjs/swagger';
import { LimitFileDto } from './limit-file.dto';

export class SearchFileDto extends PickType(LimitFileDto, [
  'type',
  'originalName',
  'fileDisName',
  'status',
]) {}
