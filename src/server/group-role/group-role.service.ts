import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) {}

  /**
   * 添加
   */
  async insertBatch(dto: GroupRole[]): Promise<GroupRole[]> {
    return await this.groupRoleRepository.save(dto);
  }

  /**
   * 获取用户组
   */
  // async selectByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupRole[]> {
  //   const { id } = baseFindByIdDto;
  //   return await this.groupRoleRepository.find({
  //     relations: ['role'],
  //     where: {
  //       groupId: id,
  //     },
  //   });
  // }

  /**
   * 获取用户组（批量）
   */
  async selectByGroupIds(dto: BaseFindByIdsDto): Promise<GroupRole[]> {
    const { ids } = dto;
    return await this.groupRoleRepository.find({
      relations: ['role'],
      where: {
        id: In(ids.split(',')),
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByGroupId(id: string): Promise<any> {
    return await this.groupRoleRepository
      .createQueryBuilder()
      .delete()
      .from(GroupRole)
      .where('groupId = :id', { id: id })
      .execute();
  }
}
