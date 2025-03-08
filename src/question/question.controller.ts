import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { AddQuestionDto } from './dto/addQuestion.dto';
import { RequireAdmin, RequireLogin } from 'src/utils/custom.decorator';
import { updateQuestionDto } from './dto/updateQuestion.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('题目模块')
@RequireLogin()
@RequireAdmin()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiBody({
    type: AddQuestionDto,
    description: '添加题目信息',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目已存在/当前用户不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '创建题目成功',
  })
  //添加题目
  @Post('add')
  async create(@Body() questionInfo: AddQuestionDto) {
    return await this.questionService.create(questionInfo);
  }
  //查询题目,可以根据题目id查询 题目标题查询 题目标签查询
  //支持分页查询
  //查询api任何用户都可以查询
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
    name: 'id',
    description: '题目id',
    type: Number,
  })
  @ApiQuery({
    name: 'title',
    description: '题目标题',
    type: String,
  })
  @ApiQuery({
    name: 'tags',
    description: '题目标签',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目已存在/当前用户不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '创建题目成功',
  })
  @RequireAdmin(0)
  @RequireLogin(false)
  @Get('search')
  async searchQuestion(
    @Query('pageNo', new DefaultValuePipe(1)) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(100)) pageSize: number,
    @Query('id') id: number,
    @Query('title') title: string,
    @Query('tags') tags: string,
  ) {
    console.log(pageNo, pageSize, id, tags);
    return await this.questionService.searchQuestion(
      pageNo,
      pageSize,
      id,
      title,
      tags,
    );
  }

  //更新题目
  @ApiBody({ type: updateQuestionDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目不存在/当前为做任何修改',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改题目成功',
  })
  @Put('update')
  async update(@Body() updateQuestion: updateQuestionDto) {
    return await this.questionService.updateQuestion(updateQuestion);
  }

  //在更新题目之后进行题信息的回显
  @ApiParam({ name: 'id', description: '查询题目id' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目不存在/当前为做任何修改',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改题目成功',
  })
  @RequireAdmin(0)
  @RequireLogin(false)
  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.questionService.findById(id);
  }

  //删除题目
  @ApiQuery({ name: 'id', description: '删除题目id' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '当前题目不存在',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '删除题目成功',
  })
  @Delete('delete')
  async delete(@Query('id') id: number) {
    return await this.questionService.delete(id);
  }
}
