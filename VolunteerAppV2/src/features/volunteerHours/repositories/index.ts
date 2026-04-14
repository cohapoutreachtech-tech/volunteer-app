<<<<<<< Updated upstream
export { volunteerHoursRepository } from '../../../repositories';
=======
import { MockVolunteerHoursRepository } from './MockVolunteerHoursRepository';
import type { VolunteerHoursRepository } from './VolunteerHoursRepository';

export const volunteerHoursRepository: VolunteerHoursRepository =
    new MockVolunteerHoursRepository();
>>>>>>> Stashed changes
