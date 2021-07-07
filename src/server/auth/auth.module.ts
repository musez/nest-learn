import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import  jwtConfig  from './../../config/jwt.config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CaptchaModule } from '../captcha/captcha.module';
import { CryptoUtil } from '../../utils/crypto.util';

@Module({
  imports: [
    UserModule,
    PassportModule,
    CaptchaModule,
    JwtModule.register({
      secret: jwtConfig.secretKey,// 设置 secret
      signOptions: { expiresIn: '7200s' },// 设置 token 的属性，时间为 3600 * 2 就是 2 小时，其余配置可以看 jwt 的一些相关
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptoUtil],// 把 AuthService，LocalStrategy，JwtStrategy 注册成提供者
  controllers: [AuthController],// 注册控制器
  exports: [AuthService],// 把这个服务抛出，给其他模块使用
})
export class AuthModule {
}
