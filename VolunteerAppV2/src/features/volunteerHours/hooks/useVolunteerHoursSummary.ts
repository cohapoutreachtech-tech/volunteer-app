// src/features/volunteerHours/hooks/useVolunteerHoursSummary.ts
import { useQuery } from '@tanstack/react-query';
import { volunteerHoursRepository } from '../repositories';

export function useVolunteerHoursSummary(volunteerId: string | undefined) {
    return useQuery({
        queryKey: ['volunteerHoursSummary', volunteerId],
        queryFn: () => volunteerHoursRepository.getSummaryByVolunteerId(volunteerId!),
        enabled: !!volunteerId,
    });
}
