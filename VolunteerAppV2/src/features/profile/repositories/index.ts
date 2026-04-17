import { MockVolunteerRepository } from './MockVolunteerRepository';
import type { VolunteerRepository } from './VolunteerRepository';

export const volunteerRepository: VolunteerRepository = new MockVolunteerRepository();
