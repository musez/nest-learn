import { PickType } from '@nestjs/swagger';
import { LimitFeedbackDto } from './limit-feedback.dto';

export class SearchFeedbackDto extends PickType(LimitFeedbackDto, [
  'name',
  'mobile',
  'email',
  'feedbackType',
  'businessType',
  'status',
]) {
}
