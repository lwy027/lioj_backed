import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  username: string;
  userRole: number;
  userAvotor: string;
}

//扩展request类型
declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

//登录守卫，主要对用户进行登录鉴权操作
//通过用户请求是否携带token进行权限控制
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(Reflector)
  private reflactor: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    //因为有的接口是不需要进行登录就可以访问的这里还需要添加对接口的权限控制,使用setmatedata实现
    //获取setmatedata的value
    const requireLogin = this.reflactor.getAllAndOverride('require_login', [
      context.getHandler(),
      context.getClass(),
    ]);
    //如果当前接口不需要登录直接返回，不需要走下面的逻辑
    if (!requireLogin) {
      return true;
    }

    //1.拿到请求头中的authorization
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      //2.进行解析拿到token,通过jwt的vertify进行token验证操作
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      //在请求中添加用户信息，这样在之后使用时可以从request中拿到
      request.user = {
        userId: data.userId,
        username: data.username,
        userRole: data.userRole,
        userAvotor: data.userAvotor,
      };
      console.log(data);
      return true;
    } catch (error) {
      throw new UnauthorizedException('token已失效请重新登录');
    }
  }
}
