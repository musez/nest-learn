import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffGroupDto } from './create-staff-group.dto';

export class UpdateStaffGroupDto extends PartialType(CreateStaffGroupDto) {}
