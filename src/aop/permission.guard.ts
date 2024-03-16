import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

//判断当前用户的权限，区分管理员和普通用户
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return true;
    }

    console.log(request.user);
    const role = request.user.userRole;
    const requireAdmin: number = this.reflector.getAllAndOverride(
      'require_admin',
      [context.getHandler(), context.getClass()],
    );

    if (role !== requireAdmin) {
      throw new UnauthorizedException('当前没有权限访问');
    }

    return true;
  }
}
