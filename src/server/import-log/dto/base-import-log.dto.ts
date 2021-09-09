import { Column } from 'typeorm';
import { ImportType } from '../../../constants/dicts.enum';

export class BaseImportLogDto {
  @Column('tinyint', {
    comment: '导入模块',
  })
  importType: ImportType;

  @Column({ comment: '成功条数', nullable: true })
  successCount: number;

  @Column('json', { comment: '成功数据', nullable: true })
  successData: string;

  @Column({ comment: '失败条数', nullable: true })
  errorCount: number;

  @Column('json', { comment: '失败数据', nullable: true })
  errorData: string;
}
