import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { BaseFindByIdDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';
import { UserRole } from '../user-role/entities/user-role.entity';

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
  async insertBatch(createGroupRoleDto: CreateGroupRoleDto[]): Promise<CreateGroupRoleDto[]> {
    return await this.groupRoleRepository.save(createGroupRoleDto);
  }

  /**
   * 获取用户组
   */
  async selectByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupRole[]> {
    return await this.groupRoleRepository.find({
      // relations: ['role'],
      where: {
        groupId: baseFindByIdDto,
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByGroupId(id: string): Promise<any> {
    return await this.groupRoleRepository.createQueryBuilder()
      .delete()
      .from(GroupRole)
      .where('groupId = :id', { id: id })
      .execute();
  }
}
