import type { Registration, RegistrationStatus } from '../../models/Registration';

export interface RegistrationsRepository {
    listByVolunteerId(volunteerId: string): Promise<Registration[]>;
    getByVolunteerAndEvent(volunteerId: string, eventId: string): Promise<Registration | null>;
    create(input: { volunteerId: string; eventId: string }): Promise<Registration>;
    updateStatus(input: { registrationId: string; status: RegistrationStatus }): Promise<Registration>;
    cancel(input: { registrationId: string }): Promise<Registration>;
}
