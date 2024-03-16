import { Module } from '@nestjs/common';
import { JudgeQuestionService } from './judge-question.service';
import { JudgeQuestionController } from './judge-question.controller';

@Module({
  controllers: [JudgeQuestionController],
  providers: [JudgeQuestionService],
})
export class JudgeQuestionModule {}
