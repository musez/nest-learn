import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';
import xlsx from 'node-xlsx';

// var excelParser = require('excel-parser');

type ObjectType = {
  id: number;
  name: string;
  address: string;
};

@Injectable()
export class ExcelService {
  /**
   * 导出 excel
   * @param titleList 标题
   * @param dataList 数据
   * @param xlsName sheet 的名称
   */
  public exportExcel(
    // titleList: Array<string>,
    titleList,
    dataList: string[],
    xlsName = 'sheet1',
  ): ArrayBuffer {
    // const data = [titleList, dataList]; // 其实最后就是把这个数组写入 excel
    const data = [];
    data.push(titleList.map((item) => {
      return item.value;
    })); // 添加完列名 下面就是添加真正的内容了
    dataList.forEach((element) => {
      const arrInner = [];
      for (let i = 0; i < titleList.length; i++) {
        arrInner.push(element[titleList[i].key]);
      }
      data.push(arrInner); // data 中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
    });

    const buffer = xlsx.build([
      {
        name: xlsName,
        data,
      },
    ]);
    return buffer;
  }

  /**
   * 导入 excel
   * @param
   */
  public importExcel() {
    // excelParser.worksheets({
    //   inFile: 'my_file.in',
    // }, function(err, worksheets) {
    //   if (err) console.error(err);
    //   // TODO
    //   console.log(worksheets);
    // });
  }
}
