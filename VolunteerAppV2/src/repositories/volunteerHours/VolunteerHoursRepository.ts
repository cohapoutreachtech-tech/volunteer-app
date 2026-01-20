// src/repositories/volunteerHours/VolunteerHoursRepository.ts

import type {
    VolunteerHoursEntry,
    VolunteerHoursSummary,
} from '../../models/VolunteerHours';


 // Backend-agnostic contract for volunteer hours / timesheets.
export interface VolunteerHoursRepository {
    /**
     * List all hour entries for a volunteer.
     * Used by the Timesheet screen.
     */
    listByVolunteerId(
        volunteerId: string
    ): Promise<VolunteerHoursEntry[]>;

    /**
     * List hour entries for a volunteer filtered by event.
     * Useful for event detail views or summaries.
     */
    listByVolunteerAndEvent(
        volunteerId: string,
        eventId: string
    ): Promise<VolunteerHoursEntry[]>;

    /**
     * Create a new shift entry (clock-in).
     */
    create(input: {
        volunteerId: string;
        eventId: string;
        clockIn: string;
        shiftDate?: string;
        notes?: string;
    }): Promise<VolunteerHoursEntry>;

    /**
     * Update an existing shift entry (clock-out, notes, approval).
     */
    update(input: {
        entryId: string;
        clockOut?: string | null;
        notes?: string;
        approvalStatus?: string;
        totalHours?: number;
    }): Promise<VolunteerHoursEntry>;

    /**
     * Delete a shift entry.
     */
    delete(entryId: string): Promise<void>;

    /**
     * Returns an aggregated summary used by the Profile screen.
     */
    getSummaryByVolunteerId(
        volunteerId: string
    ): Promise<VolunteerHoursSummary>;
}
