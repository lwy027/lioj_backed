import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不为空',
  })
  @ApiProperty()
  userName: string;
  @IsNotEmpty({
    message: '密码不为空',
  })
  @MinLength(6, {
    message: '密码不能少于6位',
  })
  @ApiProperty()
  password: string;
}
