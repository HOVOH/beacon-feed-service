import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { FeedService } from '../feed/feed.service';
import {
  TweetEvent,
  TweetFeedEvent,
} from '../feed/feed-events/tweet-feed-event.entity';
import { KAFKA_SERVICE_NAME } from './constants';
import { TwitterFollowingFeedEvent } from '../feed/feed-events/twitter-following-feed-event.entity';
import {
  JsonParserPipe,
  MapPipe,
  PipelineFactory,
} from '@hovoh/ts-data-pipeline';
import { ValidateTopicsPipe } from '../pipes/validate-topics.pipe';
import { PlainToClassPipe } from '../pipes/plain-to-class.pipe';
import { TweetToFeedPipe } from '../pipes/tweet-to-feed.pipe';

const TWITTER_TWEET_KAFKA_EVENT = 'twitter.tweet';
const TWITTER_FOLLOWING_KAFKA_EVENT = 'twitter.user.following';

@Controller()
export class KafkaConsumerController implements OnModuleInit {
  private tweetEventPipelineFactory: PipelineFactory<unknown, TweetFeedEvent>;
  constructor(
    private feedService: FeedService,
    @Inject(KAFKA_SERVICE_NAME) private client: KafkaService,
  ) {
    this.tweetEventPipelineFactory = new PipelineFactory<any, TweetFeedEvent>(
      () => [
        {
          name: 'json_parser',
          pipe: new JsonParserPipe<any>(),
        },
        {
          name: 'validate_topics',
          pipe: new ValidateTopicsPipe(),
        },
        {
          name: 'cast_object',
          pipe: new TweetToFeedPipe(),
        },
        {
          name: 'save_event',
          pipe: new MapPipe((event) => this.feedService.saveFeedEvent(event)),
        },
      ],
    );
  }

  onModuleInit(): any {
    this.client.subscribeToResponseOf(TWITTER_TWEET_KAFKA_EVENT, this);
    this.client.subscribeToResponseOf(TWITTER_FOLLOWING_KAFKA_EVENT, this);
  }

  @SubscribeTo(TWITTER_TWEET_KAFKA_EVENT)
  async receiveTweet(data: string) {
    const { data: event, health } =
      await this.tweetEventPipelineFactory.processUnit(data);
    if (
      health.stagesHealth[2].batchSize > 1 &&
      health.stagesHealth[2].errors.length > 1
    ) {
      console.log(health.stagesHealth[2].errors);
    }
  }

  @SubscribeTo(TWITTER_FOLLOWING_KAFKA_EVENT)
  async receiveFollowingUpdate(data: string) {
    await this.feedService.saveFeedEvent(
      new TwitterFollowingFeedEvent(JSON.parse(data)),
    );
  }
}
