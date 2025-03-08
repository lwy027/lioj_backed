import { BadRequestException, Injectable } from '@nestjs/common';
import { SubmitQuestionDto } from './dto/submitQuestion.dto';
import { QuestionSubmit } from './entities/questionSubmit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { execFile } from 'child_process';
import { judgeCase } from 'src/type';
import { Observable, forkJoin, from, map } from 'rxjs';
import { stderr } from 'process';
interface JudgedCase extends judgeCase {
  isCorrect: boolean;
  score: number;
}

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

    //使用代码沙箱进行判断当前用户提交的代码是否正确  可以拿到输出与答案进行比较
    //首先设置题目的状态为判题中 判题状态 0 待判题 1 判题中 2 成功 3 失败

    /** 题目判断信息
     *   Accepted: '成功';
   WrongAnswar: '答案错误';
  CompileError: '编译错误';
  MemoryLinitExceeded: '内存溢出';
  TimeLimitExceeded: '超时';
  PresentationError: '展示错误';
  OutputLimitExceeded: '输出溢出';
  Waiting: '等待中';
  DangerousOperation: '危险操作';
  RuntimeError: '运行错误'; //用户程序的问题
  SystemError: '系统错误'; //做系统人的问题
     */
    newSubmit.status = 1;
    console.log('----');
    const res = this.codeSandBox(submitQuestionInfo.code, foundQuestion);
    console.log(res);
    // //根据判题结果设置当前题目的状态
    // if (res) {
    //   newSubmit.judgeInfo.Accepted = newSubmit.judgeInfo.Accepted;
    //   newSubmit.status = 2;
    //   //保存题目提交状态
    //   await this.submitQuestionRepository.save(newSubmit);

    //   //最后返回题目判题info
    //   return newSubmit.judgeInfo;
    // } else {
    //   //如果不通过,设置题目状态为3，题目运行info为
    //   newSubmit.status = 3;
    //   console.log('当前题目运行失败');
    // }
  }

  //查询题目
  async searchSubmitQuestion(
    pageNo: number,
    pageSize: number,
    userId: number,
    questionId: number,
    status: number,
  ) {
    if (pageNo < 1) {
      pageNo = 1;
    }
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

  //判题接口
  //使用execFile方法来创建一个沙箱环境运行用户的代码
  async codeSandBox(code: string, question: Question) {
    // 使用child_process执行代码
    let score = 0;
    const resultDetails: JudgedCase[] = [];

    const promises: Observable<JudgedCase>[] = question.judgeCase.map(
      (testCase) =>
        from(this.runUserCode(code, testCase)).pipe(
          map(({ output }) => ({
            input: testCase.input,
            output,
            expectedOutput: testCase.output,
            isCorrect: output.trim() === testCase.output,
            score: output.trim() === testCase.output ? 1 : 0,
          })),
        ),
    );

    const judgedCases = await forkJoin(promises).toPromise();

    judgedCases.forEach((judgedCase) => {
      score += judgedCase.score;
      resultDetails.push(judgedCase);
    });

    return { score, resultDetails };
  }
  private runUserCode(
    code: string,
    testCase: judgeCase,
  ): Promise<{ output: string }> {
    return new Promise((resolve, reject) => {
      const childProcess = execFile('node', ['-'], (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }

        console.log(stdout);
        resolve({ output: stdout.trim().toString() });
      });
      console.log(stderr);
      // 将用户代码和测试用例的输入写入子进程的stdin
      childProcess.stdin.write(`${code}\n`);
      childProcess.stdin.write(testCase.input);
      childProcess.stdin.end();
    });
  }
}
