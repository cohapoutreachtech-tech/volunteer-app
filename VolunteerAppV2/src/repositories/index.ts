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

// Central switchboard that re-exports concrete repository instances from feature folders.
import { eventsRepository } from '@features/events/repositories';
import { volunteerRepository } from '@features/profile/repositories';
import { registrationsRepository } from '@features/registrations/repositories';
import { volunteerHoursRepository } from '@features/volunteerHours/repositories';

export { eventsRepository, volunteerRepository, registrationsRepository, volunteerHoursRepository };

export type { EventsRepository } from '@features/events/repositories/EventsRepository';
export type { VolunteerRepository } from '@features/profile/repositories/VolunteerRepository';
export type { RegistrationsRepository } from '@features/registrations/repositories/RegistrationsRepository';
export type { VolunteerHoursRepository } from '@features/volunteerHours/repositories/VolunteerHoursRepository';
