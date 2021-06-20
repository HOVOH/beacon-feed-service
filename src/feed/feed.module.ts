import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetFeedEvent } from './feed-events/tweet-feed-event.entity';
import { FeedEvent } from './feed-events/feed-event.entity';
import { FeedController } from './feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TweetFeedEvent, FeedEvent])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
