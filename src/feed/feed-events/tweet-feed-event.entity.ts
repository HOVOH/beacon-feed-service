import { ChildEntity } from 'typeorm';
import { FeedEvent } from './feed-event.entity';
import { Exclude, Expose } from 'class-transformer';

export const TWEET_FEED_EVENT = 'TWEET_FEED_EVENT';

export class TweetEvent {
  @Expose()
  tweetId: string;
  @Expose()
  text: string;
  @Expose()
  authorId: string;
  @Expose()
  authorUsername: string;
  @Expose()
  authorName: string;
  @Expose()
  createdAt: string;
  @Expose()
  references: { type: string; id: string }[];
}

@ChildEntity()
export class TweetFeedEvent extends FeedEvent<TweetEvent> {
  constructor(payload: any) {
    super(TWEET_FEED_EVENT);
    this.data = payload;
  }
}
