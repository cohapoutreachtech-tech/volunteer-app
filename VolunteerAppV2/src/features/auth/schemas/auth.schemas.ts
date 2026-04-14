import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  token: z.string().min(1),
  volunteer: z.object({
    id: z.string(),
    Email__c: z.string().email(),
    First_Name__c: z.string(),
    Last_Name__c: z.string(),
    Status__c: z.string(),
  }),
});

