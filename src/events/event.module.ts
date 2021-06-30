import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from './event.service';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { KafkaConsumerController } from './kafka-consumer.controller';
import { FeedModule } from '../feed/feed.module';
import { KAFKA_SERVICE_NAME } from './constants';
import {
  EnvironmentModule,
  EnvironmentService,
} from '@hovoh/nestjs-environment-module';
import { IEnv } from '../app.module';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    KafkaModule.registerAsync([KAFKA_SERVICE_NAME], {
      imports: [EnvironmentModule],
      useFactory: async ({ env }: EnvironmentService<IEnv>) => [
        {
          name: KAFKA_SERVICE_NAME,
          options: {
            client: {
              brokers: [env.KAFKA_BROKER],
            },
            consumer: {
              groupId: 'feed-server',
              allowAutoTopicCreation: true,
            },
          },
        },
      ],
      inject: [EnvironmentService],
    }),
    FeedModule,
  ],
  controllers: [KafkaConsumerController],
  providers: [EventService],
  exports: [EventService, KafkaModule],
})
export class EventModule {}
