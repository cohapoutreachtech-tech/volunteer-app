// src/features/profile/hooks/useVolunteer.ts
import { useQuery } from '@tanstack/react-query';
import { volunteerRepository } from '../repositories';

export function useVolunteer(id: string | undefined) {
  return useQuery({
    queryKey: ['volunteer', id],
    queryFn: () => volunteerRepository.getVolunteerById(id!),
    enabled: !!id,
  });
}
