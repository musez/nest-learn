import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ImportLogService } from './import-log.service';
import { CreateImportLogDto } from './dto/create-import-log.dto';
import { UpdateImportLogDto } from './dto/update-import-log.dto';

@Controller('import-log')
export class ImportLogController {
  constructor(private readonly importLogService: ImportLogService) {}
}
