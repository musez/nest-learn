import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AppService } from '../../app.service';

@Module({
  controllers: [TaskController],
  providers: [AppService, TaskService],
})
export class TaskModule {
}
