import { IsNotEmpty } from 'class-validator';
import { JudgeConfig, judgeCase } from 'src/type';

export class AddQuestionDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  userId: number;
  @IsNotEmpty({
    message: '题目标题不能为空',
  })
  title: string;
  @IsNotEmpty({
    message: '题目内容不能为空',
  })
  content: string;
  @IsNotEmpty({
    message: '题目标签不能为空',
  })
  tags: string;
  @IsNotEmpty({
    message: '题目答案不能为空',
  })
  answer: string;
  @IsNotEmpty({
    message: '判题用例不能为空',
  })
  judgeCase: Array<judgeCase>;
  @IsNotEmpty({
    message: '判题限制不能为空',
  })
  judgeConfig: JudgeConfig;
}
