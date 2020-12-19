import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, IStrategyOptions } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'userPwd',
    } as IStrategyOptions);
  }

  async validate(userName: string, userPwd: string): Promise<any> {
    const user = await this.authService.validateUser(userName, userPwd);
    if (user) return user;
    else throw new UnauthorizedException('用户名或密码错误！');
  }
}
