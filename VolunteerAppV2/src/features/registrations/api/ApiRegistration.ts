// src/api/models/ApiRegistration.ts

import { z } from 'zod';

/**
 * Transport / wire model for Registration as returned by the REST API.
 * Mirrors backend JSON contract (Mongo/Mongoose + Salesforce-style fields).
 *
 * Notes:
 * - `_id` is Mongo id
 * - `name` is a display id like "REG-0001" (if present)
 * - `Volunteer__c` / `Event__c` may be either:
 *   - a string id, OR
 *   - a populated object containing at least `_id` (and possibly more fields)
 */
const PopulatedRefSchema = z.object({
    _id: z.string(),
}).strict()

const RefSchema = z.union([z.string(), PopulatedRefSchema]);

export const ApiRegistrationSchema = z.object({
    _id: z.string(),
    name: z.string().optional(),

    Volunteer__c: RefSchema,
    Event__c: RefSchema,

    Registration_Status__c: z.string().optional(),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
}).strict();

export type ApiRegistration = z.infer<typeof ApiRegistrationSchema>;
