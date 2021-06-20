import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  EnvironmentModule,
  EnvironmentService,
} from '@hovoh/nestjs-environment-module';
import { IEnv } from './app.module';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      useFactory: ({ env }: EnvironmentService<IEnv>) => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: env.JWT_EXPIRES_IN },
      }),
      inject: [EnvironmentService],
    }),
  ],
  exports: [JwtModule],
})
export class GlobalModule {}
