<<<<<<< Updated upstream
export { eventsRepository } from '../../../repositories';
=======
import { MockEventsRepository } from './MockEventsRepository';
import type { EventsRepository } from './EventsRepository';

export const eventsRepository: EventsRepository = new MockEventsRepository();
>>>>>>> Stashed changes
