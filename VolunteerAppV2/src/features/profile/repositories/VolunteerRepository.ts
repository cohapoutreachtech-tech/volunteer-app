

import type { Volunteer } from '@core/models/Volunteer';

export interface VolunteerRepository {
  getVolunteerById(id: string): Promise<Volunteer | null>;

}