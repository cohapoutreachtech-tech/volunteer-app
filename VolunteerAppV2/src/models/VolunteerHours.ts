// src/models/VolunteerHours.ts

export type ApprovalStatus =
    | 'Pending'
    | 'Approved'
    | 'Rejected'
    | string;

/**
 * Represents a single clock-in / clock-out entry.
 * Mirrors backend VolunteerHours schema but cleaned for frontend use.
 */
export type VolunteerHoursEntry = {
    id: string;
    displayId?: string;

    volunteerId: string;
    eventId: string;

    shiftDate?: string; // YYYY-MM-DD
    clockIn?: string;   // ISO datetime
    clockOut?: string | null;

    totalHours?: number;

    approvalStatus?: ApprovalStatus;

    submittedAt?: string; // ISO datetime
    notes?: string;


    event?: {
        id: string;
        title?: string;
        date?: string;
        location?: string;
    };
};


export type VolunteerHoursSummary = {
    volunteerId: string;

    approvedHours: number;
    pendingHours?: number;

    lifetimeHours?: number;

    asOf?: string; // ISO datetime
};
