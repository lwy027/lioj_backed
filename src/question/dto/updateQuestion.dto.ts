import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JudgeConfig, judgeCase } from 'src/type';

export class updateQuestionDto {
  //需要根据id判断需要更新的问题
  // @IsNotEmpty({
  //   message: 'id不能为空',
  // })
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;
  @IsNotEmpty({
    message: '题目标题不能为空',
  })
  @ApiProperty()
  title: string;
  @IsNotEmpty({
    message: '题目内容不能为空',
  })
  @ApiProperty()
  content: string;
  @IsNotEmpty({
    message: '题目标签不能为空',
  })
  @ApiProperty()
  tags: string;
  @IsNotEmpty({
    message: '题目答案不能为空',
  })
  @ApiProperty()
  answer: string;
  @IsNotEmpty({
    message: '判题用例不能为空',
  })
  @ApiProperty()
  judgeCase: Array<judgeCase>;
  @IsNotEmpty({
    message: '判题限制不能为空',
  })
  @ApiProperty()
  judgeConfig: JudgeConfig;
}
