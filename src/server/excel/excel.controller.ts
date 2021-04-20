import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}
}
