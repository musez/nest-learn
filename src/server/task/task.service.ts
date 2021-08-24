import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { exec } from 'child_process';

const cmdStr = 'sh ../../../bin/bash.sh';//这里面写你要执行的命令就行

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron('45 * * * * *')
  // handleMysqlBak() {
  //   // exec(cmdStr, (err, stdout, stderr) => {
  //     exec('mysqldump -uroot -pdmkj_root cms_nest > e:/bak/sql/mysql.sql', (err, stdout, stderr) => {
  //     // 将 mysql 执行命令作为参数输入
  //
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log('sync.....');
  //     console.log(`stdout: ${stdout}`);
  //     console.log(`stderr: ${stderr}`);
  //   });
  //   console.log('bak end');
  // }

  // * * * * * *
  // | | | | | |
  // | | | | | day of week
  // | | | | month
  // | | | day of month
  // | | hour
  // | minute
  // second (optional)

  // * * * * * *：每一秒
  // 45 * * * * *：每分钟，在45秒
  // * 10 * * * *：每小时一次，十分钟开始
  // 0 */30 9-17 * * *：上午九时至下午五时，每三十分钟一次
  // 0 30 11 * * 1-5：星期一至星期五上午11:30

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('该方法将在 45 秒标记处每分钟运行一次');
  // }
  //
  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('2');
  // }
  //
  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('3');
  // }
  //
  // @Interval(10000)
  // sendEmail() {
  //   this.logger.debug('3');
  // }
}
