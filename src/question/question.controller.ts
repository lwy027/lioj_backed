import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { AddQuestionDto } from './dto/addQuestion.dto';
import { RequireAdmin, RequireLogin } from 'src/utils/custom.decorator';
import { updateQuestionDto } from './dto/updateQuestion.dto';

@RequireLogin()
@RequireAdmin()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  //添加题目
  @Post('add')
  async create(@Body() questionInfo: AddQuestionDto) {
    return await this.questionService.create(questionInfo);
  }
  //查询题目,可以根据题目id查询 题目标题查询 题目标签查询
  //支持分页查询
  //查询api任何用户都可以查询
  @RequireAdmin(0)
  @RequireLogin(false)
  @Get('search')
  async searchQuestion(
    @Query('pageNo', new DefaultValuePipe(1)) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(5)) pageSize: number,
    @Query('id') id: number,
    @Query('title') title: string,
    @Query('tags') tags: string,
  ) {
    return await this.questionService.searchQuestion(
      pageNo,
      pageSize,
      id,
      title,
      tags,
    );
  }

  //更新题目
  @Put('update')
  async update(@Body() updateQuestion: updateQuestionDto) {
    return await this.questionService.updateQuestion(updateQuestion);
  }

  //在更新题目之后进行题信息的回显
  @RequireAdmin(0)
  @RequireLogin(false)
  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.questionService.findById(id);
  }

  //删除题目
  @Delete('delete')
  async delete(@Query('id') id: number) {
    return await this.questionService.delete(id);
  }
}
