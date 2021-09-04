import { PickType } from '@nestjs/swagger';
import { BaseFeedbackDto } from './base-feedback.dto';

export class CreateFeedbackDto extends PickType(BaseFeedbackDto, [
  'name',
  'mobile',
  'email',
  'feedbackType',
  'businessType',
  'screenshotId',
  'content',
  'status',
  'description',
]) {
}
