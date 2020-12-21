import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  /**
   * validate username and password
   * @param username
   * @param password
   */
  async validateUser(userName: string, userPwd: string): Promise<any> {
    const user = await this.userService.selectByName(userName);
    // 注：实际中的密码处理应通过加密措施
    if (user && user.userPwd === userPwd) {
      const { userPwd, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  /**
   * user login
   * @param user
   */
  async login(user: any) {
    const payload = { username: user.userName, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
