import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = (isLogin: boolean = true) =>
  SetMetadata('require_login', isLogin);
export const RequireAdmin = (role: number = 1) =>
  SetMetadata('require_admin', role);

//自定义param参数
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
