import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ImportType } from '../../../constants/dicts.enum';

@Entity('sys_import_log')
export class ImportLog extends BaseEntity {
  constructor() {
    super();

    this.importType = undefined;
    this.successCount = undefined;
    this.successData = undefined;
    this.errorCount = undefined;
    this.errorData = undefined;
  }

  @Column('tinyint', { comment: '导入模块', nullable: true, default: ImportType.AREA })
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
