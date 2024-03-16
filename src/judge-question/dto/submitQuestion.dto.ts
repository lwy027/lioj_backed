import { IsNotEmpty } from 'class-validator';

export class SubmitQuestionDto {
  @IsNotEmpty({
    message: '使用语言不能为空',
  })
  language: string;
  @IsNotEmpty({
    message: '代码不能为空',
  })
  code: string;
  @IsNotEmpty({
    message: '用户id不可以为空',
  })
  userId: number;
  @IsNotEmpty({
    message: '题目id不可以为空',
  })
  questionId: number;
}
