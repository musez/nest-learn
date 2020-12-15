import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateStaffGroupDto } from './dto/create-staff-group.dto';
import { UpdateStaffGroupDto } from './dto/update-staff-group.dto';
import { Staff } from '../staff/entities/staff.entity';
import { StaffGroup } from './entities/staff-group.entity';

@Injectable()
export class StaffGroupService {
  constructor(
    @InjectRepository(StaffGroup)
    private readonly staffGroupService: Repository<StaffGroup>,
  ) {
  }

  create(createStaffGroupDto: CreateStaffGroupDto) {
    return 'This action adds a new staffGroup';
  }

  findAll() {
    return `This action returns all staffGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staffGroup`;
  }

  update(id: number, updateStaffGroupDto: UpdateStaffGroupDto) {
    return `This action updates a #${id} staffGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffGroup`;
  }
}
