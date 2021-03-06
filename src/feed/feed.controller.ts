import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { KeysetPage } from '@hovoh/nestjs-api-lib';
import { EventsOrderBy, FeedService } from './feed.service';
import { KeysetResults } from '@hovoh/nestjs-api-lib';
import { AccessTokenGuard, errors } from '@hovoh/nestjs-authentication-lib';
import { CatchApplicationError } from '@hovoh/nestjs-application-error';
import { GetFeedRequest } from './GetFeedRequest';

@Controller('api/v1/feed')
@UseGuards(AccessTokenGuard)
@CatchApplicationError({
  ...errors.authErrorStatusMap,
})
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  async getFeed(
    @Query() requ: GetFeedRequest,
    @Query() page: KeysetPage<EventsOrderBy>,
  ) {
    const events = await this.feedService.getFeed(requ, page);
    return new KeysetResults(events, (e) => e.id.toString());
  }
}
