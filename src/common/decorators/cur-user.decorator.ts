import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { userinfo } = request.headers;
    const user = request.user;
    const curUser = Object.assign(user, JSON.parse(userinfo));

    return data ? curUser && curUser[data] : curUser;
  },
);
