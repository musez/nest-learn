import { Global, Module } from '@nestjs/common';
import { ImportLogService } from './import-log.service';
import { ImportLogController } from './import-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportLog } from './entities/import-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImportLog])],
  controllers: [ImportLogController],
  providers: [ImportLogService],
  exports:[ImportLogService]
})
export class ImportLogModule {
}
