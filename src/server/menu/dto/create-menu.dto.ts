import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseMenuDto } from './base-menu.dto';

export class CreateMenuDto extends PickType(BaseMenuDto,
  ['parentId', 'name', 'routerPath', 'routerName', 'routerRedirect', 'routerComponent', 'routerHidden', 'routerTitle', 'routerIcon', 'routerSort', 'code', 'status', 'description'],
) {
}
