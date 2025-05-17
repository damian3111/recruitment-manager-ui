// lib/candidatesService.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CandidateFilter } from '@/components/CandidateFilters';

export function useCandidatesFiltered(filters: CandidateFilter) {
    return useQuery({
        queryKey: ['candidates', filters],
        queryFn: async () => {
            const { data } = await axios.post('/api/candidates/filter', filters); // Proxy to Spring Boot
            return data;
        },
    });
}
