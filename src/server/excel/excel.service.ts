import { Injectable } from '@nestjs/common';
import { exportExcel, importExcel } from '../../utils/excel';

@Injectable()
export class ExcelService {
  /**
   * 导出 excel
   * @param columns 列
   * @param rows 数据
   * @param sheetName sheet 的名称
   */
  async exportExcel(columns, rows, sheetName = 'sheet1') {
    return await exportExcel(columns, rows, sheetName);
  }

  /**
   * 导入 excel
   * @param columns 表头
   * @param file 文件
   */
  async importExcel(columns, file) {
    return await importExcel(columns, file.buffer, true);
  }
}
