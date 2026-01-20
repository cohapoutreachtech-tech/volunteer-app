// src/hooks/useEvent.ts


/*
5) src/hooks/useEvent.ts
Purpose: A reusable hook that loads one event by id, and manages:
event
isLoading
error
refetch()

*/
import { useCallback, useEffect, useState } from 'react';
import type { Event } from '../models/EventDataModel';
import { eventsRepository } from '../repositories';

type UseEventResult = {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useEvent(id: string | undefined): UseEventResult {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setEvent(null);
      setIsLoading(false);
      setError('Missing event id');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await eventsRepository.getEventById(id);
      setEvent(data);
      if (!data) setError('Event not found');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load event';
      setError(msg);
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { event, isLoading, error, refetch: load };
}
