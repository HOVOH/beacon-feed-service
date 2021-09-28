import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  EnvironmentModule,
  EnvironmentService,
} from '@hovoh/nestjs-environment-module';
import { IEnv } from './app.module';
import * as fs from 'fs';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvironmentModule],
      useFactory: ({ env }: EnvironmentService<IEnv>) => ({
        publicKey: fs.readFileSync(env.JWT_PUBLIC_CERTIFICATE_PATH),
        verifyOptions: { algorithms: ['ES256'] },
      }),
      inject: [EnvironmentService],
    }),
  ],
  exports: [JwtModule],
})
export class GlobalModule {}
