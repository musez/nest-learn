import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { LimitArticleCatDto } from './limit-article-cat.dto';

export class SearchArticleCatDto extends PickType(LimitArticleCatDto, ['catName']) {
}
