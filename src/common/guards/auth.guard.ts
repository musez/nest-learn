import { CanActivate, ExecutionContext, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../server/user/user.service';
import { ApiException } from '../exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('UserService')
    private readonly userService: UserService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const user = req['user'];
    if (!user) throw new ApiException('没有权限执行此操作！', ApiErrorCode.FORBIDDEN, HttpStatus.OK);
    if (user.userType === 0) {
      // 普通用户不能进行任何操作
      throw new ApiException('没有权限执行此操作！', ApiErrorCode.FORBIDDEN, HttpStatus.OK);
    } else if (user.userType === 2) {
      // 超级管理员可以进行任何操作
      return true;
    }
    // 当前请求所需权限
    const currentPerm = this.reflector.get<string>(
      'auth',
      context.getHandler(),
    );
    // 空， 标识不需要权限
    if (!currentPerm) return true;
    // 根据用户 id 查询所拥有的权限
    const permList = await this.userService.selectAuthPermissionsByUserId(user.id);
    const perms: string[] = [];
    for (let i = 0, len = permList.length; i < len; i++) {
      permList[i]['code'].indexOf(',') > -1
        ? perms.push(...permList[i]['code'].split(','))
        : perms.push(permList[i]['code']);
    }

    // currentPerm 有值，则需对比该用户所有权限
    // return perms.includes(currentPerm)
    // nestjs 原生 ForbiddenException 英文，不符合，所以抛出自定义异常
    if (perms.includes(currentPerm)) return true;
    throw new ApiException('没有权限执行此操作！', ApiErrorCode.FORBIDDEN, HttpStatus.OK);
  }
}
