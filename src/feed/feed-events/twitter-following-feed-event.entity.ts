import { ChildEntity } from 'typeorm';
import { FeedEvent } from './feed-event.entity';

export const TWITTER_FOLLOWING_EVENT = 'TWITTER_FOLLOWING_EVENT';

@ChildEntity()
export class TwitterFollowingFeedEvent extends FeedEvent<any> {
  constructor(payload) {
    super(TWITTER_FOLLOWING_EVENT);
    this.data = payload;
  }
}
