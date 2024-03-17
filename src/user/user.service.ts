import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import md5 from 'src/utils/md5';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserVo } from './vo/user.vo';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  userRepository: Repository<User>;
  //注册
  async register(registerUser: RegisterUserDto) {
    //1.拿到用户信息进行数据库插入操作,并且对用户密码进行脱敏操作
    //查询数据库是否有当前用户
    //用户头像功能暂时不做
    const foundUser = await this.userRepository.findOneBy({
      userName: registerUser.userName,
    });

    if (foundUser) {
      throw new HttpException(
        '当前用户已存在，请重新输入用户名',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new User();

    newUser.userName = registerUser.userName;
    newUser.userPassword = md5(registerUser.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  //登录
  async login(loginUser: LoginUserDto) {
    //查询数据库是否有当前用户并且判断密码是否正确
    //登录之后使用jwy颁发token，当用户以后登录时都需要进行token认证

    const foundUser = await this.userRepository.findOneBy({
      userName: loginUser.userName,
    });
    if (!foundUser) {
      throw new HttpException('当前用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.userPassword !== md5(loginUser.password)) {
      throw new HttpException('密码不正确请重新输入', HttpStatus.BAD_REQUEST);
    }

    const vo = new UserVo();
    vo.userInfo = {
      id: foundUser.id,
      userName: foundUser.userName,
      userAvotor: foundUser.userAvator,
      userRole: foundUser.userRole,
    };
    return vo;
  }
}
