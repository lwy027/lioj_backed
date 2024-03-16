import { Module } from '@nestjs/common';
import { JudgeQuestionService } from './judge-question.service';
import { JudgeQuestionController } from './judge-question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { QuestionSubmit } from './entities/questionSubmit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question, QuestionSubmit])],
  controllers: [JudgeQuestionController],
  providers: [JudgeQuestionService],
})
export class JudgeQuestionModule {}
