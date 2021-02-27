import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { BaseFindByIdDto } from '../base.dto';
import { Utils } from '../../utils';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
  }

  /**
   * 添加
   */
  async insert(file, curUser?): Promise<CreateFileDto> {
    return await this.fileRepository.save(file);
  }

  /**
   * 添加（批量）
   */
  async batchInsert(files, curUser?): Promise<CreateFileDto[]> {
    return await this.fileRepository.save(files);
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<CreateFileDto> {
    let { id } = baseFindByIdDto;
    return await this.fileRepository.findOne(id);
  }

  async selectByExtId(extId: string): Promise<CreateFileDto[]> {
    return await this.fileRepository.find({ extId: extId });
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.fileRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.fileRepository.remove(isExist);
  }
}
