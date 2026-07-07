// src/features/events/hooks/useEvent.ts
import { useQuery } from '@tanstack/react-query';
import { eventsRepository } from '../repositories';

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsRepository.getEventById(id!),
    enabled: !!id,
  });
}
