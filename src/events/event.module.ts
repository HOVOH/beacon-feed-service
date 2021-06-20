import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from './event.service';
import { KafkaModule } from '@rob3000/nestjs-kafka';
import { KafkaConsumerController } from './kafka-consumer.controller';
import { FeedModule } from '../feed/feed.module';
import { KAFKA_SERVICE_NAME } from './constants';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    KafkaModule.register([
      {
        name: KAFKA_SERVICE_NAME,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'feed-server',
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
    /*KafkaModule.registerAsync([KAFKA_SERVICE_NAME], {
      useFactory: async () => [
        {
          name: KAFKA_SERVICE_NAME,
          options: {
            client: {
              brokers: ['localhost:9092'],
            },
            consumer: {
              groupId: 'feed-server',
              allowAutoTopicCreation: true,
            },
          },
        },
      ],
    }),*/
    FeedModule,
  ],
  controllers: [KafkaConsumerController],
  providers: [EventService],
  exports: [EventService, KafkaModule],
})
export class EventModule {}
