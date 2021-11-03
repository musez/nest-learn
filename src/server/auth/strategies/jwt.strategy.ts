import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PlatformType } from '../../../constants/dicts.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      // 获取请求 header token 值
      // jwtFromRequest: ExtractJwt.fromHeader('token'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 接收一个 passport-jwt 对象的 ExtractJwt 的 fromAuthHeaderAsBearerToken 方法执行的结果（JwtFromRequestFunction 类型）
      ignoreExpiration: false, // 接收一个布尔类型，是否忽略过期时间，正常是 false，不忽略过期
      secretOrKey: config.get('jwt.secretKey'), // 就是加密的时候的密钥，需要一致才能解密
    } as StrategyOptions);
  }

  async validate(payload: any) {
    // payload：jwt-passport 认证 jwt 通过后解码的结果
    return {
      id: payload.sub,
      username: payload.username,
      userType: payload.userType,
    };
  }
}
