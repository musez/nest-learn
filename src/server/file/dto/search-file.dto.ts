import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { LimitFileDto } from './limit-file.dto';

export class SearchFileDto extends PickType(LimitFileDto, ['originalName', 'fileDisName', 'status']) {

}
