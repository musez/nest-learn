import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  // @IsNotEmpty({ message: '数据不为空' })
  // readonly id: string;
  @IsNotEmpty()
  readonly userName: string;
  @IsNotEmpty()
  readonly userPwd: string;
  // @IsString()
  // readonly name: string;
  // @IsInt()
  // readonly sex: number;
}
