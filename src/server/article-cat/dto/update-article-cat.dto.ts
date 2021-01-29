import { IsNotEmpty, IsString, IsInt, IsEmail, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateArticleCatDto } from './create-article-cat.dto';

export class UpdateArticleCatDto extends PartialType(CreateArticleCatDto) {
    @ApiProperty({ description: '主键 id', example: '' })
    @IsNotEmpty({ message: '主键 id 不能为空' })
    @IsUUID('all')
    readonly id: string;
}
