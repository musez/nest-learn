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

  async insert(file, body): Promise<CreateFileDto> {
    let fileEntity = new File();

    // 获取 body 中的文本参数
    let { description, extId } = body;

    fileEntity.extId = extId;
    fileEntity.description = description;
    fileEntity.originalName = file.originalname;
    fileEntity.encoding = file.encoding;
    fileEntity.mimeType = file.mimetype;
    fileEntity.destination = file.destination;
    fileEntity.fileName = file.filename;
    fileEntity.path = file.path;
    fileEntity.size = file.size;
    fileEntity.fileUrl = `${file.destination}/${file.filename}`;

    return await this.fileRepository.save(fileEntity);
  }

  async batchInsert(files, body): Promise<CreateFileDto[]> {
    let filesEntity = [];

    // 获取 body 中的文本参数
    let { description, extId } = body;

    for (const file of files.files) {
      let fileEntity = new File();

      fileEntity.extId = extId;
      fileEntity.description = description;
      fileEntity.originalName = file.originalname;
      fileEntity.encoding = file.encoding;
      fileEntity.mimeType = file.mimetype;
      fileEntity.destination = file.destination;
      fileEntity.fileName = file.filename;
      fileEntity.path = file.path;
      fileEntity.size = file.size;
      fileEntity.fileUrl = `${file.destination}/${file.filename}`;

      filesEntity.push(fileEntity);
    }

    return await this.fileRepository.save(filesEntity);
  }

  selectById(id) {
    return this.fileRepository.findOne(id);
  }

  selectByExtId(extId) {
    return this.fileRepository.find({ extId: extId });
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
