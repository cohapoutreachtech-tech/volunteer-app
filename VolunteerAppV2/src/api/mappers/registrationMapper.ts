// src/api/mappers/registrationMapper.ts

import { ApiRegistration } from '../models/ApiRegistration';
import { Registration } from '../../models/Registration';

/**
 * Extracts an id
 */
function extractId(ref: string | { _id: string }): string {
    return typeof ref === 'string' ? ref : ref._id;
}

/**
 * Maps API Registration to Domain Registration
 */
export function mapApiRegistrationToDomain(
    api: ApiRegistration
): Registration {
    return {
        id: api._id,
        displayId: api.name,

        volunteerId: extractId(api.Volunteer__c),
        eventId: extractId(api.Event__c),

        status: api.Registration_Status__c ?? 'Registered',

        createdAt: api.createdAt,
        updatedAt: api.updatedAt,
    };
}
