import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class BaseQiniuDto {
  @ApiProperty({ description: 'key', example: null })
  @IsDefined({ message: 'key 不能为空！' })
  @IsNotEmpty({ message: 'key 不能为空！' })
  readonly key: string;
}