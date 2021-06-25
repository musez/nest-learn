import { PartialType } from '@nestjs/mapped-types';
import { CreateHolidayCatDto } from './create-holiday-cat.dto';

export class UpdateHolidayCatDto extends PartialType(CreateHolidayCatDto) {}
