// src/features/volunteerHours/hooks/useVolunteerHours.ts
import { useQuery } from '@tanstack/react-query';
import { volunteerHoursRepository } from '../repositories';

export function useVolunteerHours(volunteerId: string | undefined) {
    return useQuery({
        queryKey: ['volunteerHours', volunteerId],
        queryFn: () => volunteerHoursRepository.listByVolunteerId(volunteerId!),
        enabled: !!volunteerId,
    });
}
