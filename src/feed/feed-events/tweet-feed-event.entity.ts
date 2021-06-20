import { ChildEntity } from 'typeorm';
import { FeedEvent } from './feed-event.entity';

export const TWEET_FEED_TYPE = 'TWEET_FEED_EVENT';

@ChildEntity()
export class TweetFeedEvent extends FeedEvent<any> {
  constructor(payload: any) {
    super(TWEET_FEED_TYPE);
    this.data = payload;
  }
}
