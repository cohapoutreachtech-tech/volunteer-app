// src/hooks/useRegistrations.ts
import { useCallback, useEffect, useState } from 'react';
import type { Registration } from '../models/Registration';
import { registrationsRepository } from '../repositories';

type UseRegistrationsResult = {
    registrations: Registration[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

export function useRegistrations(volunteerId: string | undefined): UseRegistrationsResult {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!volunteerId) {
            setRegistrations([]);
            setIsLoading(false);
            setError('Missing volunteer id');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const items = await registrationsRepository.listByVolunteerId(volunteerId);
            setRegistrations(items);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load registrations';
            setError(message);
            setRegistrations([]);
        } finally {
            setIsLoading(false);
        }
    }, [volunteerId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return {
        registrations,
        isLoading,
        error,
        refetch: fetchData,
    };
}
