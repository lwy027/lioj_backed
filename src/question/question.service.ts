import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddQuestionDto } from './dto/addQuestion.dto';
import { Like, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { updateQuestionDto } from './dto/updateQuestion.dto';

@Injectable()
export class QuestionService {
  @InjectRepository(Question)
  private questionRepository: Repository<Question>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  //创建题目
  async create(questioninfo: AddQuestionDto) {
    //1.根据题目名查询是否存在现在的题目
    const foundQues = await this.questionRepository.findOneBy({
      title: questioninfo.title,
    });
    if (foundQues) {
      throw new HttpException('当前题目已存在', HttpStatus.BAD_REQUEST);
    }

    //2.查询当前用户id是否存在

    const foundUser = await this.userRepository.findOneBy({
      id: questioninfo.userId,
    });

    if (!foundUser) {
      throw new HttpException('当前用户不存在', HttpStatus.BAD_REQUEST);
    }

    //3.如果不存在则创建题目并且返回

    const newQues = new Question();
    newQues.title = questioninfo.title;
    newQues.answer = questioninfo.answer;
    newQues.content = questioninfo.content;
    newQues.tags = questioninfo.tags;
    newQues.judgeCase = questioninfo.judgeCase;
    newQues.judgeConfig = questioninfo.judgeConfig;
    newQues.judgeConfig = questioninfo.judgeConfig;
    newQues.user = foundUser;

    await this.questionRepository.save(newQues);
    return '创建题目成功';
  }

  //查询题目
  async searchQuestion(
    pageNo: number,
    pageSize: number,
    id: number,
    title: string,
    tags: string,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (id) {
      condition.id = id;
    }

    if (title) {
      condition.title = Like(`%${title}%`);
    }
    if (tags) {
      condition.tags = Like(`%${tags}%`);
    }

    const [data, totalCount] = await this.questionRepository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });
    return {
      data,
      totalCount,
    };
  }
  //更新题目
  async updateQuestion(updateQuestion: updateQuestionDto) {
    //1.根据传来的id查询是否存在当前题目
    const question = await this.questionRepository.findOneBy({
      id: updateQuestion.id,
    });
    if (!question) {
      throw new BadRequestException('当前题目不存在');
    }
    if (
      question.title == updateQuestion.title &&
      question.content == updateQuestion.content &&
      question.tags == updateQuestion.tags &&
      question.answer == updateQuestion.answer &&
      question.judgeCase == updateQuestion.judgeCase &&
      question.judgeConfig == updateQuestion.judgeConfig
    ) {
      throw new HttpException('当前未作任何修改', HttpStatus.BAD_REQUEST);
    }
    question.title = updateQuestion.title;
    question.content = updateQuestion.content;
    question.tags = updateQuestion.tags;
    question.answer = updateQuestion.answer;
    question.judgeConfig = updateQuestion.judgeConfig;
    question.judgeCase = updateQuestion.judgeCase;

    //更新操作
    await this.questionRepository.update(
      {
        id: updateQuestion.id,
      },
      question,
    );

    return 'success';
  }

  //更新题目之后进行信息的回显
  async findById(id: number) {
    return await this.questionRepository.findOneBy({
      id,
    });
  }

  //删除题目
  async delete(id: number) {
    const ques = await this.questionRepository.findOneBy({
      id,
    });

    if (!ques) {
      throw new BadRequestException('当前题目不存在');
    }

    await this.questionRepository.delete({
      id,
    });
    return '删除题目成功';
  }
}
