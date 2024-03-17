import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty()
  id: number;
  @ApiProperty({ example: '张三' })
  userName: string;
  @ApiProperty({ example: 0, description: '0:普通用户 1:管理员' })
  userRole: number;
  @ApiProperty({ example: 'http://localhost:3000' })
  userAvotor: string;
  @ApiProperty({ example: 'xxxx-xx-xx' })
  createDate: Date;
  @ApiProperty({ example: 'xxxx-xx-xx' })
  updateDate: Date;
}

export class UserVo {
  userInfo: UserInfo;
  @ApiProperty({ description: '当前用户token' })
  accessToken: string;
}
