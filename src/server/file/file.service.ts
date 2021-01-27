import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
  }

  async insert(curUser, file): Promise<CreateFileDto> {
    return await this.fileRepository.save(file);
  }

  async batchInsert(files): Promise<CreateFileDto[]> {
    return await this.fileRepository.save(files);
  }

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<CreateFileDto> {
    let { id } = baseFindByIdDto;
    return await this.fileRepository.findOne(id);
  }

  async selectByExtId(extId: string): Promise<CreateFileDto[]> {
    return await this.fileRepository.find({ extId: extId });
  }
}
