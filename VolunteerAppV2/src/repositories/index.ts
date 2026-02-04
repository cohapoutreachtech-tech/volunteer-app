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

import { MockEventsRepository } from './events/MockEventsRepository';
import type { EventsRepository } from './events/EventsRepository';

import { MockVolunteerRepository } from './volunteers/MockVolunteerRepository';
import type { VolunteerRepository } from './volunteers/VolunteerRepository';

import { MockRegistrationsRepository } from './registrations/MockRegistrationsRepository';
import type { RegistrationsRepository } from './registrations/RegistrationsRepository';

import { MockVolunteerHoursRepository } from './volunteerHours/MockVolunteerHoursRepository';
import type { VolunteerHoursRepository } from './volunteerHours/VolunteerHoursRepository';

// Existing
export const eventsRepository: EventsRepository = new MockEventsRepository();
export const volunteerRepository: VolunteerRepository = new MockVolunteerRepository();

// New
export const registrationsRepository: RegistrationsRepository =
    new MockRegistrationsRepository();

export const volunteerHoursRepository: VolunteerHoursRepository =
    new MockVolunteerHoursRepository();


