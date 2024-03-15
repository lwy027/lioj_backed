import { Body, Controller, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  jwtService: JwtService;

  //用户注册
  @Post('register')
  async register(@Body() userRegister: RegisterUserDto) {
    return await this.userService.register(userRegister);
  }

  //用户登录,登录时使用jwt颁发token方式,以后每一次请求进行验证
  @Post('login')
  async login(@Body() userLogin: LoginUserDto) {
    const vo = await this.userService.login(userLogin);
    //颁发token
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.userName,
      useRole: vo.userInfo.userRole,
      userAvotor: vo.userInfo.userAvotor,
    });
    return vo;
  }
}
