export class Event<T> {
  readonly name: string;

  readonly data: T;

  constructor(name: string, data: T) {
    this.name = name;
    this.data = data;
  }
}
