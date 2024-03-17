import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { JudgeQuestionService } from './judge-question.service';
import { RequireLogin } from 'src/utils/custom.decorator';
import { SubmitQuestionDto } from './dto/submitQuestion.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('判题模块')
@RequireLogin()
@Controller('judge-question')
export class JudgeQuestionController {
  constructor(private readonly judgeQuestionService: JudgeQuestionService) {}

  //1.提交题目
  @ApiBody({
    type: SubmitQuestionDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目/用户不存在,请重新提交',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '提交成功',
  })
  @Post('submitQuestion')
  submitQuestion(@Body() submitQuestionInfo: SubmitQuestionDto) {
    return this.judgeQuestionService.submitQuestion(submitQuestionInfo);
  }

  //查询题目提交信息接口,可以根据用户id,题目id，题目状态去查询提交状态
  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
  })
  @ApiQuery({
    name: 'userId',
    description: '用户id',
    type: Number,
  })
  @ApiQuery({
    name: 'questionId',
    description: '题目id',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    description: '题目状态',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目已存在/当前用户不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '创建题目成功',
  })
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
