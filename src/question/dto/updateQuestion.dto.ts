import { PartialType } from '@nestjs/mapped-types';

import { AddQuestionDto } from './addQuestion.dto';
import { IsNotEmpty } from 'class-validator';

export class updateQuestionDto extends PartialType(AddQuestionDto) {
  //需要根据id判断需要更新的问题
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}
