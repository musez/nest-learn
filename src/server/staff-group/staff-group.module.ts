import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffGroupService } from './staff-group.service';
import { StaffGroupController } from './staff-group.controller';
import { StaffGroup } from './entities/staff-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffGroup])],
  controllers: [StaffGroupController],
  providers: [StaffGroupService]
})
export class StaffGroupModule {}
