import { MockEventsRepository } from './MockEventsRepository';
import type { EventsRepository } from './EventsRepository';

export const eventsRepository: EventsRepository = new MockEventsRepository();
