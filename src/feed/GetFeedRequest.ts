import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';
import { FeedEventType, FeedEventTypes } from './feed.service';

export class GetFeedRequest {
  @IsOptional()
  @Transform(
    ({ value }) => {
      return value
        ?.split(',')
        .map((string) => string.toUpperCase())
        .filter((string) => FeedEventTypes.includes(string));
    },
    { toClassOnly: true },
  )
  types: FeedEventType[];
}
