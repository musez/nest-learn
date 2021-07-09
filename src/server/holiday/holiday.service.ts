import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Holiday } from './entities/holiday.entity';
import { SearchHolidayDto } from './dto/search-holiday.dto';
import { LimitHolidayDto } from './dto/limit-holiday.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createHolidayDto: CreateHolidayDto, curUser?): Promise<CreateHolidayDto> {
    const holiday = new Holiday();
    holiday.createBy = curUser && curUser.id;
    await this.holidayRepository.save(createHolidayDto);

    return createHolidayDto;
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createHolidayDto: CreateHolidayDto[], curUser?): Promise<CreateHolidayDto[]> {
    const holidayList: CreateHolidayDto[] = [];

    createHolidayDto.forEach(item => {
      let holiday = new Holiday();
      holiday = Utils.dto2entityImport(item, holiday);

      holiday.createBy = curUser && curUser.id;
      holidayList.push(holiday);
    });
    await this.holidayRepository.save(holidayList);

    return createHolidayDto;
  }

  /**
   * 获取列表
   */
  async selectList(searchHolidayDto: SearchHolidayDto): Promise<any[]> {
    const { name, weekday, restType } = searchHolidayDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(weekday)) {
      queryConditionList.push('weekday = :weekday');
    }
    if (!Utils.isBlank(restType)) {
      queryConditionList.push('restType = :restType');
    }

    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.holidayRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        weekday: weekday,
        restType: restType,
      })
      .orderBy('createTime', 'DESC')
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitHolidayDto: LimitHolidayDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, weekday, restType } = limitHolidayDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(weekday)) {
      queryConditionList.push('weekday = :weekday');
    }
    if (!Utils.isBlank(restType)) {
      queryConditionList.push('restType = :restType');
    }

    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.holidayRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        weekday: weekday,
        restType: restType,
      })
      .skip(offset)
      .take(limit)
      .orderBy('createTime', 'DESC')
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Holiday> {
    const { id } = baseFindByIdDto;
    return await this.holidayRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.holidayRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 获取 n 天内的日期
   */
  async selectDays(dayList, curUser?): Promise<any> {
    const queryConditionList = [];
    if (dayList.length > 0) {
      queryConditionList.push('date IN (:date)');
    }

    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const dayListStr = dayList.map(v => {
      return v.toString();
    });

    const ret = await this.holidayRepository.createQueryBuilder()
      .where(queryCondition, {
        date: dayListStr,
      })
      .orderBy('createTime', 'DESC')
      .getMany();
    return ret;
  }

  /**
   * 修改
   */
  async update(updateHolidayDto: UpdateHolidayDto, curUser?): Promise<void> {
    const { id } = updateHolidayDto;

    const isExistId = await this.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let holiday = new Holiday();
    holiday = Utils.dto2entity(updateHolidayDto, holiday);
    holiday.updateBy = curUser && curUser.id;

    await this.holidayRepository.update(id, holiday);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    const { ids, status } = baseModifyStatusByIdsDto;

    return this.holidayRepository.createQueryBuilder()
      .update(Holiday)
      .set({ status: status, updateBy: curUser && curUser.id })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.holidayRepository.createQueryBuilder()
      .update(Holiday)
      .set({ deleteStatus: 1, deleteBy: curUser && curUser.id })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.holidayRepository.createQueryBuilder()
      .update(Holiday)
      .set({ deleteStatus: 1, deleteBy: curUser && curUser.id })
      .where('ids in (:ids)', { ids: ids })
      .execute();
  }
}