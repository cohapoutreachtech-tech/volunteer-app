

import type { Volunteer } from '../../models/Volunteer';

export interface VolunteerRepository {
  getVolunteerById(id: string): Promise<Volunteer | null>;

}