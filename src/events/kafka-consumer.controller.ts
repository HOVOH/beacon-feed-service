import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { FeedService } from '../feed/feed.service';
import { TweetFeedEvent } from '../feed/feed-events/tweet-feed-event.entity';
import { KAFKA_SERVICE_NAME } from './constants';
import { TwitterFollowingFeedEvent } from '../feed/feed-events/twitter-following-feed-event.entity';

const TWITTER_TWEET_KAFKA_EVENT = 'twitter.tweet';
const TWITTER_FOLLOWING_KAFKA_EVENT = 'twitter.user.following';

@Controller()
export class KafkaConsumerController implements OnModuleInit {
  constructor(
    private feedService: FeedService,
    @Inject(KAFKA_SERVICE_NAME) private client: KafkaService,
  ) {}

  @SubscribeTo(TWITTER_TWEET_KAFKA_EVENT)
  async receiveTweet(data: string) {
    await this.feedService.saveFeedEvent(new TweetFeedEvent(JSON.parse(data)));
  }

  @SubscribeTo(TWITTER_FOLLOWING_KAFKA_EVENT)
  async receiveFollowingUpdate(data: string) {
    await this.feedService.saveFeedEvent(
      new TwitterFollowingFeedEvent(JSON.parse(data)),
    );
  }

  onModuleInit(): any {
    this.client.subscribeToResponseOf(TWITTER_TWEET_KAFKA_EVENT, this);
    this.client.subscribeToResponseOf(TWITTER_FOLLOWING_KAFKA_EVENT, this);
  }
}
