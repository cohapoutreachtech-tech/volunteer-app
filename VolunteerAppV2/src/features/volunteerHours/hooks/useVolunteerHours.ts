// src/hooks/useVolunteerHours.ts
import { useCallback, useEffect, useState } from 'react';
import type { VolunteerHoursEntry } from '../models/VolunteerHours';
import { volunteerHoursRepository } from '../repositories';

type UseVolunteerHoursResult = {
    entries: VolunteerHoursEntry[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export function useVolunteerHours(volunteerId: string | undefined): UseVolunteerHoursResult {
    const [entries, setEntries] = useState<VolunteerHoursEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!volunteerId) {
            setEntries([]);
            setIsLoading(false);
            setError('Missing volunteer id');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const items = await volunteerHoursRepository.listByVolunteerId(volunteerId);
            setEntries(items);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load volunteer hours';
            setError(message);
            setEntries([]);
        } finally {
            setIsLoading(false);
        }
    }, [volunteerId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        entries,
        isLoading,
        error,
        refetch: fetchData,
    };
}
