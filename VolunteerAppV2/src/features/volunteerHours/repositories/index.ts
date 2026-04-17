import { MockVolunteerHoursRepository } from './MockVolunteerHoursRepository';
import type { VolunteerHoursRepository } from './VolunteerHoursRepository';

export const volunteerHoursRepository: VolunteerHoursRepository = new MockVolunteerHoursRepository();
