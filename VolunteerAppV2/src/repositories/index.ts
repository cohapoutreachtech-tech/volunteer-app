/*
    3) src/repositories/index.ts
    Purpose: A single “switchboard” that decides 
    which repository implementation the app uses.
    Right now it exports:
    eventsRepository = new MockEventsRepository()
    Later: this is the only place you should need to 
    change to swap in ApiEventsRepository.
*/

// src/repositories/index.ts

export { eventsRepository } from '@features/events/repositories';
export { volunteerRepository } from '@features/profile/repositories';
export { registrationsRepository } from '@features/registrations/repositories';
export { volunteerHoursRepository } from '@features/volunteerHours/repositories';

export type { EventsRepository } from '@features/events/repositories/EventsRepository';
export type { VolunteerRepository } from '@features/profile/repositories/VolunteerRepository';
export type { RegistrationsRepository } from '@features/registrations/repositories/RegistrationsRepository';
export type { VolunteerHoursRepository } from '@features/volunteerHours/repositories/VolunteerHoursRepository';


