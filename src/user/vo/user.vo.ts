class UserInfo {
  id: number;
  userName: string;
  userRole: number;
  userAvotor: string;
  createDate: Date;
  updateDate: Date;
}

export class UserVo {
  userInfo: UserInfo;
  accessToken: string;
}
