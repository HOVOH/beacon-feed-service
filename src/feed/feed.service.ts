import { Injectable } from '@nestjs/common';
import { FeedEvent } from './feed-events/feed-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import {
  keySetFilter,
  KeysetPage,
  MongoQueryBuilder,
} from '@hovoh/nestjs-api-lib';
import { ObjectId } from 'mongodb';
import { TWEET_FEED_EVENT } from './feed-events/tweet-feed-event.entity';
import { TWITTER_FOLLOWING_EVENT } from './feed-events/twitter-following-feed-event.entity';

const CREATED_AT_FIELD = 'createdAt';
const ID_FIELD = '_id';

const orderableMembers = [CREATED_AT_FIELD, ID_FIELD] as const;

export type EventsOrderBy = typeof orderableMembers[number];

export const FeedEventTypes = [TWEET_FEED_EVENT, TWITTER_FOLLOWING_EVENT];
export type FeedEventType = typeof FeedEventTypes[number];

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEvent)
    private feedEventRepository: MongoRepository<FeedEvent<any>>,
  ) {}

  async saveFeedEvent<T extends FeedEvent<any>>(event: T) {
    return this.feedEventRepository.save(event);
  }

  async getFeed(
    query: { types: FeedEventType[] },
    page?: KeysetPage<EventsOrderBy>,
  ) {
    page.order = 'DES';
    page.orderBy = ID_FIELD;
    const builder = new MongoQueryBuilder();
    builder
      .addIf(query.types, () => ({
        where: {
          type: {
            $in: query.types,
          },
        },
      }))
      .addIf(page, () => this.pageToQuery(page));
    return this.feedEventRepository.find(builder.query);
  }

  pageToQuery(page: KeysetPage<string>) {
    return keySetFilter(page, (field, value) => {
      if (!value) return null;
      if (field === CREATED_AT_FIELD) {
        return new Date(value);
      }
      if (field === ID_FIELD) {
        return new ObjectId(value);
      }
      return value;
    });
  }
}
