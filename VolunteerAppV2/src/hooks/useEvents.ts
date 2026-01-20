// src/hooks/useEvents.ts

/*

4) src/hooks/useEvents.ts
Purpose: A reusable hook that loads the events list for the UI, and manages:
events (data)
isLoading
error


*/


import { useCallback, useEffect, useState } from 'react';
import type { Event } from '../models/EventDataModel';
import { eventsRepository } from '../repositories';

//shape
type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
//States
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await eventsRepository.getEvents();
      setEvents(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load events';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, isLoading, error, refetch: load };
}
