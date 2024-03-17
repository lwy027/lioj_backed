import { ApiProperty } from '@nestjs/swagger';
import { JudgeConfig, judgeCase } from 'src/type';

class Question {
  @ApiProperty()
  id: number;
  @ApiProperty({
    description: '题目标题',
    type: String,
    example: '回文子串',
  })
  title: string;
  @ApiProperty({
    description: '题目内容',
    type: String,
    example: 'aaaa',
  })
  content: string;
  @ApiProperty({
    description: '题目标签',
    type: String,
    example: '链表 哈希',
  })
  tags: string;
  @ApiProperty({
    description: '题目答案',
    type: String,
    example: 'bbb',
  })
  answer: string;
  @ApiProperty({
    description: '题目提交数',
    type: Number,
    example: '111',
  })
  submitNum: number;
  @ApiProperty({
    description: '题目通过数',
    type: Number,
    example: '回文子串',
  })
  acceptNum: number;
  @ApiProperty({
    description: '题目用例',
    type: Array<judgeCase>,
  })
  judgeCase: Array<judgeCase>;
  @ApiProperty({
    description: '题目限制',
    type: JudgeConfig,
  })
  judgeConfig: JudgeConfig;
  @ApiProperty({
    description: '题目点赞数',
    type: Number,
  })
  thumbNum: number;
  @ApiProperty({
    description: '题目喜欢数',
    type: Number,
  })
  favourNum: number;
  @ApiProperty({
    description: '是否删除',
    type: Number,
  })
  isDelete: number;
  @ApiProperty({
    description: '创建时间',
    type: Date,
  })
  createDate: Date;
  @ApiProperty({
    description: '更新时间',
    type: Date,
  })
  updateDate: Date;
}

export class QuestionListVo {
  @ApiProperty({
    type: Question,
  })
  questions: Question[];
  @ApiProperty({
    description: '返回数据数',
    type: Number,
  })
  totalCount: number;
}
