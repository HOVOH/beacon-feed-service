import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SerializeInterceptor } from '@hovoh/nestjs-api-lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new SerializeInterceptor());
  await app.listen(3002);
}
bootstrap();
