import { Module } from '@nestjs/common';
import { HolidayCatService } from './holiday-cat.service';
import { HolidayCatController } from './holiday-cat.controller';

@Module({
  controllers: [HolidayCatController],
  providers: [HolidayCatService]
})
export class HolidayCatModule {}
