

// src/models/Registration.ts

export type RegistrationStatus =
    | 'Registered'
    | 'Confirmed'
    | 'Cancelled'
    | 'Waitlisted'
    | string;

/**
 * Domain model (frontend-friendly, backend-agnostic but close to API).
 * - Mongo `_id` is mapped to `id`
 * - Backend `name` like "REG-0001" is mapped to `displayId`
 * - References are normalized to ids (`volunteerId`, `eventId`)
 */
export type Registration = {
    id: string;
    displayId?: string;

    volunteerId: string;
    eventId: string;

    status: RegistrationStatus;

    createdAt?: string; // ISO datetime
    updatedAt?: string; // ISO datetime

    /**
     * Optional summaries if the backend returns populated refs sometimes.
     * Keep small to avoid coupling the app to backend population behavior.
     */
    event?: {
        id: string;
        title?: string;
        date?: string; // ISO or YYYY-MM-DD
        location?: string;
    };

    volunteer?: {
        id: string;
        displayId?: string;
        firstName?: string;
        lastName?: string;
    };
};
