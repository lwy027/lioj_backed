import { Controller } from '@nestjs/common';
import { JudgeQuestionService } from './judge-question.service';

@Controller('judge-question')
export class JudgeQuestionController {
  constructor(private readonly judgeQuestionService: JudgeQuestionService) {}
}
