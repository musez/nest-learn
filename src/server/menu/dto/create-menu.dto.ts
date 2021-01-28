import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { BaseMenuDto } from './base-menu.dto';

export class CreateMenuDto extends PickType(BaseMenuDto,
  ['name', 'routerPath', 'routerName', 'routerRedirect', 'routerComponent', 'routerHidden', 'routerTitle', 'routerIcon', 'routerSort', 'parentId', 'status', 'description'],
) {
}
