import { BadRequestException, Injectable } from '@nestjs/common';
import { SubmitQuestionDto } from './dto/submitQuestion.dto';
import { QuestionSubmit } from './entities/questionSubmit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JudgeQuestionService {
  @InjectRepository(Question)
  private questionRepository: Repository<Question>;
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(QuestionSubmit)
  private submitQuestionRepository: Repository<QuestionSubmit>;
  //根据id查询用户和题目
  async findQuesAndUser(userId: number, QuesId: number) {
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!foundUser) {
      throw new BadRequestException('当前用户不存在,请重新提交');
    }
    const foundQuestion = await this.questionRepository.findOneBy({
      id: QuesId,
    });
    if (!foundQuestion) {
      throw new BadRequestException('当前题目不存在,请重新提交');
    }
    return {
      foundUser,
      foundQuestion,
    };
  }

  //提交题目
  async submitQuestion(submitQuestionInfo: SubmitQuestionDto) {
    //1.判断用户传递的用户id和题目id是否存在
    const { foundUser, foundQuestion } = await this.findQuesAndUser(
      submitQuestionInfo.userId,
      submitQuestionInfo.questionId,
    );
    //2.保存用户提交信息
    const newSubmit = new QuestionSubmit();
    newSubmit.language = submitQuestionInfo.language;
    newSubmit.code = submitQuestionInfo.code;
    newSubmit.user = foundUser;
    newSubmit.question = foundQuestion;

    await this.submitQuestionRepository.save(newSubmit);

    return 'success';
  }

  //查询题目
  async searchSubmitQuestion(
    pageNo: number,
    pageSize: number,
    userId: number,
    questionId: number,
    status: number,
  ) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    //1.判断用户传递的用户id和题目id是否存在
    const { foundUser, foundQuestion } = await this.findQuesAndUser(
      userId,
      questionId,
    );
    if (foundUser) {
      condition.user = foundUser.id;
    }
    if (foundQuestion) {
      condition.question = foundQuestion.id;
    }
    if (status) {
      condition.status = status;
    }

    const [data, totalCount] = await this.submitQuestionRepository.findAndCount(
      {
        skip: skipCount,
        take: pageSize,
        where: condition,
      },
    );
    console.log(data);
    return {
      data,
      totalCount,
    };
  }
}
