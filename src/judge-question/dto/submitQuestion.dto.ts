import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubmitQuestionDto {
  @IsNotEmpty({
    message: '使用语言不能为空',
  })
  @ApiProperty()
  language: string;
  @IsNotEmpty({
    message: '代码不能为空',
  })
  @ApiProperty()
  code: string;
  @IsNotEmpty({
    message: '用户id不可以为空',
  })
  @ApiProperty()
  userId: number;
  @IsNotEmpty({
    message: '题目id不可以为空',
  })
  @ApiProperty()
  questionId: number;
}
