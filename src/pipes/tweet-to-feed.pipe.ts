import { TransformerPipe } from '@hovoh/ts-data-pipeline';
import {
  TweetEvent,
  TweetFeedEvent,
} from '../feed/feed-events/tweet-feed-event.entity';

interface ITweet {
  tweetId: string;
  text: string;
  lang: string;
  authorId: string;
  createdAt: string;
  conversationId: string;
  meta: { references: { type: string; id: string }[] };
}

interface IAuthor {
  userId: string;
  username: string;
  name: string;
}

export class TweetToFeedPipe extends TransformerPipe<any, TweetFeedEvent> {
  async transform(element: {
    data: { tweet: ITweet; author: IAuthor };
  }): Promise<TweetFeedEvent> {
    const tweet = element.data.tweet;
    const author = element.data.author;
    const tweetEvent = new TweetEvent();
    tweetEvent.tweetId = tweet.tweetId;
    tweetEvent.text = tweet.text;
    tweetEvent.authorId = author.userId;
    tweetEvent.authorUsername = author.username;
    tweetEvent.authorName = author.name;
    tweetEvent.createdAt = tweet.createdAt;
    tweetEvent.references = tweet.meta.references;
    return new TweetFeedEvent(tweetEvent);
  }
}
