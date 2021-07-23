import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('用户地址')
@ApiBasicAuth('token')
@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get()
  findAll() {
    return this.userAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    return this.userAddressService.update(+id, updateUserAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAddressService.remove(+id);
  }
}