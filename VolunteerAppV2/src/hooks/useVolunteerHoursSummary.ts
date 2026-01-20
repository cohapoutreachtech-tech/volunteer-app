// src/hooks/useVolunteerHoursSummary.ts
import { useCallback, useEffect, useState } from 'react';
import type { VolunteerHoursSummary } from '../models/VolunteerHours';
import { volunteerHoursRepository } from '../repositories';

type UseVolunteerHoursSummaryResult = {
    summary: VolunteerHoursSummary | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export function useVolunteerHoursSummary(
    volunteerId: string | undefined
): UseVolunteerHoursSummaryResult {
    const [summary, setSummary] = useState<VolunteerHoursSummary | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!volunteerId) {
            setSummary(null);
            setIsLoading(false);
            setError('Missing volunteer id');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const result = await volunteerHoursRepository.getSummaryByVolunteerId(volunteerId);
            setSummary(result);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load hours summary';
            setError(message);
            setSummary(null);
        } finally {
            setIsLoading(false);
        }
    }, [volunteerId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        summary,
        isLoading,
        error,
        refetch: fetchData,
    };
}
