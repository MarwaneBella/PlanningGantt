import { Injectable } from '@angular/core';
import { GanttEvent } from './GanttEvent';

@Injectable({
  providedIn: 'root'
})
export class GanttService {

  private events: GanttEvent[] = [];

  getEvents(): GanttEvent[] {
    return this.events;
  }

  addEvent(event: GanttEvent): void {
    this.events.push(event);
  }

  removeEvent(eventId: number): void {
    this.events = this.events.filter((event) => event.id !== eventId);
  }
}
