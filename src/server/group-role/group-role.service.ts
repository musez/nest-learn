import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { BaseFindByIdDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createGroupRoleDto: CreateGroupRoleDto[]): Promise<CreateGroupRoleDto[]> {
    return await this.groupRoleRepository.save(createGroupRoleDto);
  }

  async selectByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupRole[]> {
    return await this.groupRoleRepository.find({
      relations: ['role'],
      where: {
        groupId: baseFindByIdDto,
      },
    });
  }
}
