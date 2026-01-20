// src/data/mockVolunteerHours.ts

import { VolunteerHoursEntry } from '../models/VolunteerHours';
import { TEMP_VOLUNTEER_ID } from './mockRegistrations';



export const mockVolunteerHours: VolunteerHoursEntry[] = [
    {
        id: 'hrs-0001',
        displayId: 'HRS-0001',

        volunteerId: TEMP_VOLUNTEER_ID,
        eventId: 'event-001',

        shiftDate: '2025-01-05',
        clockIn: '2025-01-05T09:00:00.000Z',
        clockOut: '2025-01-05T12:30:00.000Z',

        totalHours: 3.5,
        approvalStatus: 'Approved',
        submittedAt: '2025-01-05T12:35:00.000Z',
    },

    {
        id: 'hrs-0002',
        displayId: 'HRS-0002',

        volunteerId: TEMP_VOLUNTEER_ID,
        eventId: 'event-003',

        shiftDate: '2025-01-12',
        clockIn: '2025-01-12T10:00:00.000Z',
        clockOut: '2025-01-12T14:00:00.000Z',

        totalHours: 4,
        approvalStatus: 'Approved',
        submittedAt: '2025-01-12T14:05:00.000Z',
    },

    {
        id: 'hrs-0003',
        displayId: 'HRS-0003',

        volunteerId: TEMP_VOLUNTEER_ID,
        eventId: 'event-002',

        shiftDate: '2025-01-18',
        clockIn: '2025-01-18T09:30:00.000Z',
        clockOut: null,

        totalHours: undefined,
        approvalStatus: 'Pending',
        submittedAt: '2025-01-18T09:35:00.000Z',
    },

    {
        id: 'hrs-0004',
        displayId: 'HRS-0004',

        volunteerId: 'other-volunteer-id',
        eventId: 'event-001',

        shiftDate: '2025-01-03',
        clockIn: '2025-01-03T08:00:00.000Z',
        clockOut: '2025-01-03T11:00:00.000Z',

        totalHours: 3,
        approvalStatus: 'Approved',
        submittedAt: '2025-01-03T11:10:00.000Z',
    },
];
