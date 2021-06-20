import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {Event} from "./event";

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {
  }


  emit(event: Event<any>){
    this.eventEmitter.emit(event.name, event);
  }

}
