// src/hooks/useVolunteer.ts

import { useCallback, useEffect, useState } from 'react';
import type { Volunteer } from '../models/Volunteer';

import { volunteerRepository } from '../repositories';

type UseVolunteerResult = {
  volunteer: Volunteer | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Fetches volunteer by id and manages state
export function useVolunteer(id: string | undefined): UseVolunteerResult {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setVolunteer(null);
      setIsLoading(false);
      setError('Missing volunteer id');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await volunteerRepository.getVolunteerById(id);
      setVolunteer(data);

      if (!data) setError('Volunteer not found');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load volunteer';
      setError(msg);
      setVolunteer(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { volunteer, isLoading, error, refetch: load };
}
