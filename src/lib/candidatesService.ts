import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/api';
export type CandidateType = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    profile_picture_url?: string;
    headline?: string;
    summary?: string;
    experience?: string;
    years_of_experience: number;
    education: string;
    certifications: string;
    work_experiences: string;
    projects: string;
    media_url?: string;
    salary_expectation?: string;
    work_style: 'Remote' | 'Hybrid' | 'On-site';
    applied_date?: string;
    location?: string;
    skills: string;
};


const API_URL = 'http://localhost:8080/candidates';

export const useCandidates = () => {
    return useQuery<CandidateType[]>({
        queryKey: ['candidates'],
        queryFn: async () => {
            const res = await axios.get(API_URL);
            return res.data;
        },
        staleTime: 1000 * 60,
    });
};

export const useCandidate = (id: number) => {
    return useQuery<CandidateType>({
        queryKey: ['candidate', id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};


export const useCandidateByEmail = (email: string) => {
    return useQuery<CandidateType>({
        queryKey: ['candidate', email],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/by-email`, {
                params: { email }
            });
            return res.data;
        },
        enabled: !!email,
    });
};


export const useCreateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newCandidate: Omit<CandidateType, 'id'>) => {
            const res = await axios.post(API_URL, newCandidate);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
        onError: (err) => {
            console.error('❌ Error creating candidate:', err);
        },
    });
};

export const useUpdateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (candidate: CandidateType) => {
            const res = await axios.put(`${API_URL}/update/${candidate.id}`, candidate);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
        onError: (err) => {
            console.error('❌ Error updating candidate:', err);
        },
    });
};

export const useDeleteCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${API_URL}/${id}`);
        },
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['candidates'] });

            const previousCandidates = queryClient.getQueryData<CandidateType[]>(['candidates']);

            queryClient.setQueryData<CandidateType[]>(['candidates'], (old = []) =>
                old.filter((c) => c.id !== id)
            );

            return { previousCandidates };
        },
        onError: (err, id, context) => {
            console.error('❌ Error deleting candidate:', err);
            if (context?.previousCandidates) {
                queryClient.setQueryData(['candidates'], context.previousCandidates);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
    });
};
