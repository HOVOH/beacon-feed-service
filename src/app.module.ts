import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { EventModule } from './events/event.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@hovoh/nestjs-api-lib';
import { GlobalModule } from './global.module';

export interface IEnv {
  ENVIRONMENT: 'prod' | 'dev' | 'test';
  DB_TYPE: 'postgres';
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

@Module({
  imports: [DatabaseModule, EventModule, GlobalModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
