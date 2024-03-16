import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin } from './utils/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RequireLogin()
  @Get('aa')
  aa() {
    return 'aaa';
  }
}
