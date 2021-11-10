import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EnvironmentModule,
  EnvironmentService,
} from '@hovoh/nestjs-environment-module';
import { IEnv } from './app.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useFactory: ({ env }: EnvironmentService<IEnv>) => {
        return {
          type: 'mongodb',
          host: env.DB_HOST,
          port: env.DB_PORT,
          username: env.DB_USER,
          password: env.DB_PASSWORD,
          database: 'test',
          authSource: 'admin',
          autoLoadEntities: true,
          logging: true,
          useUnifiedTopology: true,
        };
      },
      inject: [EnvironmentService],
    }),
  ],
})
export class DatabaseModule {}
