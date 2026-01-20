// src/repositories/registrations/MockRegistrationsRepository.ts

import type { Registration, RegistrationStatus } from '../../models/Registration';
import type { RegistrationsRepository } from './RegistrationsRepository';
import { mockRegistrations } from '../../data/mockRegistrations';

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomMongoId(): string {
    // 24 hex chars (Mongo-like)
    const hex = '0123456789abcdef';
    let out = '';
    for (let i = 0; i < 24; i += 1) {
        out += hex[Math.floor(Math.random() * hex.length)];
    }
    return out;
}

function nextDisplayId(existing: Registration[]): string {
    const nums = existing
        .map((r) => r.displayId)
        .filter((v): v is string => typeof v === 'string')
        .map((v) => {
            const m = v.match(/REG-(\d+)/);
            return m ? Number(m[1]) : NaN;
        })
        .filter((n) => Number.isFinite(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `REG-${String(next).padStart(4, '0')}`;
}

export class MockRegistrationsRepository implements RegistrationsRepository {
    private registrations: Registration[];
    private readonly latencyMs: number;

    constructor(options?: { latencyMs?: number; seed?: Registration[] }) {
        this.latencyMs = options?.latencyMs ?? 150;
        const seed = options?.seed ?? mockRegistrations;
        // copy to avoid mutating imported mock data
        this.registrations = seed.map((r) => ({ ...r }));
    }

    async listByVolunteerId(volunteerId: string): Promise<Registration[]> {
        await sleep(this.latencyMs);
        return this.registrations.filter((r) => r.volunteerId === volunteerId);
    }

    async getByVolunteerAndEvent(
        volunteerId: string,
        eventId: string
    ): Promise<Registration | null> {
        await sleep(this.latencyMs);
        return (
            this.registrations.find(
                (r) => r.volunteerId === volunteerId && r.eventId === eventId
            ) ?? null
        );
    }

    async create(input: {
        volunteerId: string;
        eventId: string;
    }): Promise<Registration> {
        await sleep(this.latencyMs);

        const existing = this.registrations.find(
            (r) => r.volunteerId === input.volunteerId && r.eventId === input.eventId
        );

        // mimic common backend behavior: don't allow duplicate active sign-ups
        if (existing && existing.status !== 'Cancelled') {
            throw new Error('Registration already exists for this volunteer and event.');
        }

        const now = new Date().toISOString();

        const created: Registration = {
            id: randomMongoId(),
            displayId: nextDisplayId(this.registrations),
            volunteerId: input.volunteerId,
            eventId: input.eventId,
            status: 'Registered',
            createdAt: now,
            updatedAt: now,
        };

        this.registrations = [created, ...this.registrations];
        return created;
    }

    async updateStatus(input: {
        registrationId: string;
        status: RegistrationStatus;
    }): Promise<Registration> {
        await sleep(this.latencyMs);

        const idx = this.registrations.findIndex((r) => r.id === input.registrationId);
        if (idx < 0) {
            throw new Error('Registration not found.');
        }

        const current = this.registrations[idx];
        const updated: Registration = {
            ...current,
            status: input.status,
            updatedAt: new Date().toISOString(),
        };

        this.registrations = [
            ...this.registrations.slice(0, idx),
            updated,
            ...this.registrations.slice(idx + 1),
        ];

        return updated;
    }

    async cancel(input: { registrationId: string }): Promise<Registration> {
        return this.updateStatus({ registrationId: input.registrationId, status: 'Cancelled' });
    }
}
