import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';
import { Org } from './entities/org.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Org])],
  controllers: [OrgController],
  providers: [OrgService],
})
export class OrgModule {}
