import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  TableInheritance,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class FeedEvent<T> {
  @ObjectIdColumn()
  @Transform(({ value }: { value: ObjectId }) => value.toString(), {
    toPlainOnly: true,
  })
  id: ObjectId;

  @Column()
  type: string;

  @Column()
  data: T;

  @CreateDateColumn()
  createdAt: Date;

  constructor(type: string) {
    this.type = type;
  }
}
