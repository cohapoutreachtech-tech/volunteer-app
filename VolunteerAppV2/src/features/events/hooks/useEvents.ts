// src/features/events/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query';
import { eventsRepository } from '../repositories';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventsRepository.getEvents(),
  });
}
