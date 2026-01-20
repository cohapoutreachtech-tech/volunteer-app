// src/repositories/volunteerHours/MockVolunteerHoursRepository.ts

import type {
    VolunteerHoursEntry,
    VolunteerHoursSummary,
} from '../../models/VolunteerHours';
import type { VolunteerHoursRepository } from './VolunteerHoursRepository';
import { mockVolunteerHours } from '../../data/mockVolunteerHours';

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomMongoId(): string {
    const hex = '0123456789abcdef';
    let out = '';
    for (let i = 0; i < 24; i += 1) {
        out += hex[Math.floor(Math.random() * hex.length)];
    }
    return out;
}

function nextDisplayId(existing: VolunteerHoursEntry[]): string {
    const nums = existing
        .map((e) => e.displayId)
        .filter((v): v is string => typeof v === 'string')
        .map((v) => {
            const m = v.match(/HRS-(\d+)/);
            return m ? Number(m[1]) : NaN;
        })
        .filter((n) => Number.isFinite(n));

    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `HRS-${String(next).padStart(4, '0')}`;
}

function sumHours(entries: VolunteerHoursEntry[]): number {
    // Only sum entries with numeric totalHours
    return entries.reduce((acc, e) => acc + (typeof e.totalHours === 'number' ? e.totalHours : 0), 0);
}

export class MockVolunteerHoursRepository implements VolunteerHoursRepository {
    private entries: VolunteerHoursEntry[];
    private readonly latencyMs: number;

    constructor(options?: { latencyMs?: number; seed?: VolunteerHoursEntry[] }) {
        this.latencyMs = options?.latencyMs ?? 150;
        const seed = options?.seed ?? mockVolunteerHours;
        this.entries = seed.map((e) => ({ ...e }));
    }

    async listByVolunteerId(volunteerId: string): Promise<VolunteerHoursEntry[]> {
        await sleep(this.latencyMs);
        return this.entries.filter((e) => e.volunteerId === volunteerId);
    }

    async listByVolunteerAndEvent(
        volunteerId: string,
        eventId: string
    ): Promise<VolunteerHoursEntry[]> {
        await sleep(this.latencyMs);
        return this.entries.filter((e) => e.volunteerId === volunteerId && e.eventId === eventId);
    }

    async create(input: {
        volunteerId: string;
        eventId: string;
        clockIn: string;
        shiftDate?: string;
        notes?: string;
    }): Promise<VolunteerHoursEntry> {
        await sleep(this.latencyMs);

        const now = new Date().toISOString();

        const created: VolunteerHoursEntry = {
            id: randomMongoId(),
            displayId: nextDisplayId(this.entries),

            volunteerId: input.volunteerId,
            eventId: input.eventId,

            shiftDate: input.shiftDate,
            clockIn: input.clockIn,
            clockOut: null,

            totalHours: undefined,
            approvalStatus: 'Pending',

            submittedAt: now,
            notes: input.notes,
        };

        this.entries = [created, ...this.entries];
        return created;
    }

    async update(input: {
        entryId: string;
        clockOut?: string | null;
        notes?: string;
        approvalStatus?: string;
        totalHours?: number;
    }): Promise<VolunteerHoursEntry> {
        await sleep(this.latencyMs);

        const idx = this.entries.findIndex((e) => e.id === input.entryId);
        if (idx < 0) {
            throw new Error('Volunteer hours entry not found.');
        }

        const current = this.entries[idx];

        const updated: VolunteerHoursEntry = {
            ...current,
            // Only set fields if provided (mimics patch-like behavior)
            clockOut: input.clockOut !== undefined ? input.clockOut : current.clockOut,
            notes: input.notes !== undefined ? input.notes : current.notes,
            approvalStatus: input.approvalStatus !== undefined ? input.approvalStatus : current.approvalStatus,
            totalHours: input.totalHours !== undefined ? input.totalHours : current.totalHours,
        };

        this.entries = [
            ...this.entries.slice(0, idx),
            updated,
            ...this.entries.slice(idx + 1),
        ];

        return updated;
    }

    async delete(entryId: string): Promise<void> {
        await sleep(this.latencyMs);
        const before = this.entries.length;
        this.entries = this.entries.filter((e) => e.id !== entryId);
        if (this.entries.length === before) {
            throw new Error('Volunteer hours entry not found.');
        }
    }

    async getSummaryByVolunteerId(volunteerId: string): Promise<VolunteerHoursSummary> {
        await sleep(this.latencyMs);

        const all = this.entries.filter((e) => e.volunteerId === volunteerId);

        const approved = all.filter((e) => e.approvalStatus === 'Approved');
        const pending = all.filter((e) => e.approvalStatus === 'Pending');

        const approvedHours = sumHours(approved);
        const pendingHours = sumHours(pending);

        return {
            volunteerId,
            approvedHours,
            pendingHours,
            lifetimeHours: sumHours(all),
            asOf: new Date().toISOString(),
        };
    }
}
