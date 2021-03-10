import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BasePermissionDto } from './base-permission.dto';

export class CreatePermissionDto extends PickType(BasePermissionDto,
  ['parentId', 'name', 'type', 'code', 'routerComponent', 'routerHidden', 'routerIcon', 'routerSort', 'routerPath', 'status', 'description'],
) {
}
