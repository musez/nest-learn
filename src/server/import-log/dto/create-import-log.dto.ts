import { PickType } from '@nestjs/swagger';
import { BaseImportLogDto } from './base-import-log.dto';

export class CreateImportLogDto extends PickType(BaseImportLogDto, [
  'importType',
  'successCount',
  'successData',
  'errorCount',
  'errorData',
]) {
}
