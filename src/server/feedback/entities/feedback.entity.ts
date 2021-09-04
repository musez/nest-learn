import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { BusinessType, FeedbackType, StatusType } from '../../../constants/dicts.enum';

@Entity('sys_feedback')
export class Feedback extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    this.mobile = undefined;
    this.email = undefined;
    this.feedbackType = undefined;
    this.businessType = undefined;
    this.screenshotId = undefined;
    this.content = undefined;
    this.status = undefined;
  }

  @Column('varchar', { comment: '姓名', length: 50, nullable: true })
  name: string;

  @Column('varchar', { comment: '手机号', length: 20, nullable: true })
  mobile: string;

  @Column('varchar', { comment: '邮箱', length: 20, nullable: true })
  email: string;

  @Column('tinyint', { comment: '建议反馈类型', nullable: true, default: FeedbackType.OTHER })
  feedbackType: FeedbackType;

  @Column('tinyint', { comment: '业务类型', nullable: true, default: BusinessType.OTHER })
  businessType: BusinessType;

  @Column('varchar', { comment: '截图地址', length: 255, nullable: true })
  screenshotId: string;

  @Column('text', { comment: '内容', nullable: true })
  content: string;

  @Column('tinyint', {
    comment: '状态（0：未发布；1：发布；2：草稿；3：回收站）',
    default: StatusType.DRAFT,
  })
  status: StatusType;
}
