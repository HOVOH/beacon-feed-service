import { TransformerPipe } from '@hovoh/ts-data-pipeline';
import { plainToClass } from 'class-transformer';
import { Type } from '@nestjs/common';

export class PlainToClassPipe<T> extends TransformerPipe<any, T> {
  public constructor(private clazz: Type<T>) {
    super();
  }

  async transform(element: any, i: number): Promise<T> {
    return plainToClass(this.clazz, element);
  }
}
