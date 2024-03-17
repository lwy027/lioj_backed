//判题配置
export class JudgeConfig {
  //时间限制
  timeLimit: number;
  //内存限制
  memoryLimit: number;
  //栈限制
  stackLimit?: number;
}
//输入输出用例
export interface judgeCase {
  input: string;
  output: string;
}

//判断信息的枚举值
export type judgeInfo = {
  Accepted: '成功';
  WrongAnswar: '答案错误';
  CompileError: '编译错误';
  MemoryLinitExceeded: '内存溢出';
  TimeLimitExceeded: '超时';
  PresentationError: '展示错误';
  OutputLimitExceeded: '输出溢出';
  Waiting: '等待中';
  DangerousOperation: '危险操作';
  RuntimeError: '运行错误'; //用户程序的问题
  SystemError: '系统错误'; //做系统人的问题
};
