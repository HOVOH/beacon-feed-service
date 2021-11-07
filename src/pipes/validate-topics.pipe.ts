import { CriticalDataError, TransformerPipe } from '@hovoh/ts-data-pipeline';
import { Event } from '../events/event';
export interface HasAnnotations {
  annotations: {
    name: string;
    value: any;
    uncertainty?: number;
  }[];
}
export type TweetMeta = HasAnnotations;

export interface Tweet {
  meta: TweetMeta;
  [j: string]: any;
}

const TOPICS = ['crypto', 'defi', 'NFT'];

type TweetEvent = Event<{ tweet: Tweet; author: any }>;

export class ValidateTopicsPipe extends TransformerPipe<
  TweetEvent,
  TweetEvent
> {
  async transform(event: TweetEvent, i: number): Promise<TweetEvent> {
    const annotations = event.data.tweet.meta.annotations ?? [];
    const topics = annotations.filter(
      (annotation) =>
        TOPICS.includes(annotation.name) &&
        annotation.value &&
        (!annotation.uncertainty || annotation.uncertainty < 0.05),
    );
    if (topics.length === 0) {
      throw new CriticalDataError('No relevant topic', annotations);
    }
    return event;
  }
}
