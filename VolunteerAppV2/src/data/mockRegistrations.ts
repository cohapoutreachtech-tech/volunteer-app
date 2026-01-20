// src/data/mockRegistrations.ts

import { Registration } from '../models/Registration';



export const TEMP_VOLUNTEER_ID = '694f15697fa85a691e4c75a4';

export const mockRegistrations: Registration[] = [
    {
        id: 'reg-0001',
        displayId: 'REG-0001',

        volunteerId: TEMP_VOLUNTEER_ID,
        eventId: 'event-001',

        status: 'Confirmed',

        createdAt: '2025-01-10T10:15:00.000Z',
        updatedAt: '2025-01-10T10:15:00.000Z',
    },

    {
        id: 'reg-0002',
        displayId: 'REG-0002',

        volunteerId: TEMP_VOLUNTEER_ID,
        eventId: 'event-003',

        status: 'Registered',

        createdAt: '2025-01-14T14:30:00.000Z',
        updatedAt: '2025-01-14T14:30:00.000Z',
    },

    {
        id: 'reg-0003',
        displayId: 'REG-0003',

        volunteerId: 'other-volunteer-id',
        eventId: 'event-002',

        status: 'Confirmed',

        createdAt: '2025-01-05T09:00:00.000Z',
        updatedAt: '2025-01-05T09:00:00.000Z',
    },
];
