import { Injectable } from '@nestjs/common';
import { FeedEvent } from './feed-events/feed-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { keySetFilter, KeysetPage } from '@hovoh/nestjs-api-lib';
import { ObjectId } from 'mongodb';

const CREATED_AT_FIELD = 'createdAt';
const ID_FIELD = '_id';

const orderableMembers = [CREATED_AT_FIELD, ID_FIELD] as const;

export type EventsOrderBy = typeof orderableMembers[number];

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedEvent)
    private tweetsRepository: MongoRepository<FeedEvent<any>>,
  ) {}

  async saveFeedEvent<T extends FeedEvent<any>>(event: T) {
    return this.tweetsRepository.save(event);
  }

  async getFeed(page?: KeysetPage<EventsOrderBy>) {
    page.order = 'DES';
    page.orderBy = ID_FIELD;
    return this.tweetsRepository.find(this.pageToQuery(page));
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
