// src/repositories/events/EventsRepository.ts

/*
  1) src/repositories/events/EventsRepository.ts
  Purpose: Defines the contract for how the app can fetch events.
  



*/

import type { Event } from '../../models/EventDataModel';

export interface EventsRepository {
  getEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | null>;
}
