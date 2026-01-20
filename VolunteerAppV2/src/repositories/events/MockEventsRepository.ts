// src/repositories/events/MockEventsRepository.ts
/*

2) src/repositories/events/MockEventsRepository.ts
Purpose: A “fake backend” that implements EventsRepository using MOCK_EVENTS.
getEvents() returns all mock events.
getEventById(id) finds and returns one event (or null).

*/


import { MOCK_EVENTS } from '../../data/MockEvents';
import type { Event } from '../../models/EventDataModel';
import type { EventsRepository } from './EventsRepository';

export class MockEventsRepository implements EventsRepository {
  async getEvents(): Promise<Event[]> {
    // Simulate async boundary (so your UI/hook logic matches real API later)
    return Promise.resolve(MOCK_EVENTS);
  }

  async getEventById(id: string): Promise<Event | null> {
    const found = MOCK_EVENTS.find((e) => e.id === id) ?? null;
    return Promise.resolve(found);
  }
}
