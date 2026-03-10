// src/api/models/ApiVolunteerHours.ts

import { z } from 'zod';

/**
 * Transport / wire model for VolunteerHours as returned by the REST API.
 * Mirrors backend JSON contract (Mongo/Mongoose + Salesforce-style fields).
 *
 * Notes:
 * - `_id` is Mongo id
 * - `name` is a display id like "HRS-0001" (if present)
 * - `Volunteer__c` / `Event__c` may be either a string id OR a populated object
 */

const PopulatedRefSchema = z
  .object({
    _id: z.string(),
  })
  .strict();

const RefSchema = z.union([z.string(), PopulatedRefSchema]);

export const ApiVolunteerHoursSchema = z
  .object({
    _id: z.string(),
    name: z.string().optional(),

    Volunteer__c: RefSchema,
    Event__c: RefSchema,

    Shift_Date__c: z.string().optional(), // YYYY-MM-DD
    Clock_In_Time__c: z.string().optional(), // ISO datetime
    Clock_Out_Time__c: z.string().nullable().optional(), // ISO datetime or null

    Total_Hours__c: z.number().optional(),

    Approval_Status__c: z.string().optional(),

    Submitted_Date__c: z.string().optional(), // ISO datetime
    Notes__c: z.string().optional(),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .strict();

export type ApiVolunteerHours = z.infer<typeof ApiVolunteerHoursSchema>;
