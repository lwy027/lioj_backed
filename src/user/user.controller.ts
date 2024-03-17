import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  jwtService: JwtService;
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前用户已存在，请重新输入用户名',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败',
  })
  //用户注册
  @Post('register')
  async register(@Body() userRegister: RegisterUserDto) {
    return await this.userService.register(userRegister);
  }

  //用户登录,登录时使用jwt颁发token方式,以后每一次请求进行验证
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前用户不存在/密码不正确',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登录成功',
  })
  @Post('login')
  async login(@Body() userLogin: LoginUserDto) {
    const vo = await this.userService.login(userLogin);
    //颁发token
    vo.accessToken = this.jwtService.sign({
      userId: vo.userInfo.id,
      username: vo.userInfo.userName,
      userRole: vo.userInfo.userRole,
      userAvotor: vo.userInfo.userAvotor,
    });
    return vo;
  }
}
