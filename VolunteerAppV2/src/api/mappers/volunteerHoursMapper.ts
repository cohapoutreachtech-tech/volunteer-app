// src/api/mappers/volunteerHoursMapper.ts

import { ApiVolunteerHours } from '../models/ApiVolunteerHours';
import { VolunteerHoursEntry } from '../../models/VolunteerHours';

/**
 * Extracts an id
 */
function extractId(ref: string | { _id: string }): string {
    return typeof ref === 'string' ? ref : ref._id;
}

/**
 * Maps API VolunteerHours to Domain VolunteerHoursEntry
 */
export function mapApiVolunteerHoursToDomain(
    api: ApiVolunteerHours
): VolunteerHoursEntry {
    return {
        id: api._id,
        displayId: api.name,

        volunteerId: extractId(api.Volunteer__c),
        eventId: extractId(api.Event__c),

        shiftDate: api.Shift_Date__c,
        clockIn: api.Clock_In_Time__c,
        clockOut: api.Clock_Out_Time__c ?? null,

        totalHours: api.Total_Hours__c,
        approvalStatus: api.Approval_Status__c,

        submittedAt: api.Submitted_Date__c,
        notes: api.Notes__c,
    };
}
