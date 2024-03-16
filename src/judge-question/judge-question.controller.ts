import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { JudgeQuestionService } from './judge-question.service';
import { RequireLogin } from 'src/utils/custom.decorator';
import { SubmitQuestionDto } from './dto/submitQuestion.dto';

@RequireLogin()
@Controller('judge-question')
export class JudgeQuestionController {
  constructor(private readonly judgeQuestionService: JudgeQuestionService) {}

  //1.提交题目
  @Post('submitQuestion')
  submitQuestion(@Body() submitQuestionInfo: SubmitQuestionDto) {
    return this.judgeQuestionService.submitQuestion(submitQuestionInfo);
  }

  //查询题目提交信息接口,可以根据用户id,题目id，题目状态去查询提交状态
  @Get('search')
  async searchQuestion(
    @Query('pageNo', new DefaultValuePipe(1)) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(5)) pageSize: number,
    @Query('userId') userId: number,
    @Query('questionId') questionId: number,
    @Query('status') status: number,
  ) {
    return await this.judgeQuestionService.searchSubmitQuestion(
      pageNo,
      pageSize,
      userId,
      questionId,
      status,
    );
  }
}
