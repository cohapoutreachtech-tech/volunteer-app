// src/hooks/useVolunteerHoursSummary.ts
import { useCallback, useEffect, useRef, useState } from 'react';
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

    // Prevent stale async completions from overwriting newer state.
    // Also avoid setting state after unmount.
    const requestSeqRef = useRef(0);

    const fetchData = useCallback(async () => {
        const requestSeq = (requestSeqRef.current += 1);

        if (!volunteerId) {
            if (requestSeq !== requestSeqRef.current) return;

            setSummary(null);
            setIsLoading(false);
            setError('Missing volunteer id');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const result = await volunteerHoursRepository.getSummaryByVolunteerId(volunteerId);

            if (requestSeq !== requestSeqRef.current) return;
            setSummary(result);
        } catch (e) {
            if (requestSeq !== requestSeqRef.current) return;

            const message = e instanceof Error ? e.message : 'Failed to load hours summary';
            setError(message);
            setSummary(null);
        } finally {
            if (requestSeq === requestSeqRef.current) {
                setIsLoading(false);
            }
        }
    }, [volunteerId]);

    useEffect(() => {
        void fetchData();

        return () => {
            requestSeqRef.current += 1;
        };
    }, [fetchData]);

    return {
        summary,
        isLoading,
        error,
        refetch: fetchData,
    };
}
