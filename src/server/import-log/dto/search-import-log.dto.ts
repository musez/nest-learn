import { PickType } from '@nestjs/swagger';
import { LimitImportLogDto } from './limit-import-log.dto';

export class SearchImportLogDto extends PickType(LimitImportLogDto, [
  'importType',
  'status',
]) {
}
