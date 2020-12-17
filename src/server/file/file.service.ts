import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
  }

  async insert(file): Promise<CreateFileDto> {
    return await this.fileRepository.save(file);
  }

  async batchInsert(files): Promise<CreateFileDto[]> {
    return await this.fileRepository.save(files);
  }

  async selectById(id: string): Promise<CreateFileDto> {
    return await this.fileRepository.findOne(id);
  }

  async selectByExtId(extId: string): Promise<CreateFileDto[]> {
    return await this.fileRepository.find({ extId: extId });
  }

  // create(createFileDto: CreateFileDto) {
  //   return 'This action adds a new file';
  // }
  //
  // findAll() {
  //   return `This action returns all file`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} file`;
  // }
  //
  // update(id: number, updateFileDto: UpdateFileDto) {
  //   return `This action updates a #${id} file`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} file`;
  // }
}
