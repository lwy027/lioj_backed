import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './aop/format-response.interceptor';
import { InvokeRecordInterceptor } from './aop/invoke-record.interceptor';
import { CustomExceptionFilter } from './aop/custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  //swagger配置

  const config = new DocumentBuilder()
    .setTitle('oj判题系统')
    .setDescription('api接口文档')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-doc', app, document);

  const configService = app.get(ConfigService);

  app.enableCors();
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
