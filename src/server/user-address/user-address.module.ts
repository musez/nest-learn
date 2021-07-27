import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { UserAddress } from './entities/user-address.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserAddress])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {
}
