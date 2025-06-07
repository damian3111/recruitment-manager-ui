import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/api';
import {JobFilter} from "@/lib/jobService";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

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
    skills?: { name: string; proficiencyLevel?: string }[];
};

export type CandidateFilter = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    headline?: string;
    min_experience?: number;
    max_experience?: number;
    education?: string;
    certifications?: string;
    projects?: string;
    salary_min?: number;
    salary_max?: number;
    work_style?: 'Remote' | 'Hybrid' | 'On-site';
    applied_date_from?: string;
    applied_date_to?: string;
    location?: string;
    skills?: { name: string; proficiencyLevel?: string }[];
};
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/candidates`;
const LOGOUT_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

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

// export const useFilteredCandidates = (filter: CandidateFilter) => {
//     return useQuery<CandidateType[]>({
//         queryKey: ['candidates', filter],
//         queryFn: async () => {
//             const res = await axios.post(`${API_URL}/filter`, filter);
//             return res.data;
//         },
//         staleTime: 1000 * 60,
//         enabled: !!filter, // Optional: disables query if no filter provided
//     });
// };

type UseFilteredCandidatesParams = {
    filter: CandidateFilter;
    page: number;
    limit: number;
};

export const useFilteredCandidates = (filter: CandidateFilter, page = 0, size = 10) => {
    return useQuery({
        queryKey: ['candidates', filter, page, size],
        queryFn: async () => {
            const res = await axios.post(`${API_URL}/filter?page=${page}&size=${size}`, filter);
            return res.data; // Expected: { data: CandidateType[], total: number, ... }
        },
        staleTime: 1000 * 60,
        enabled: !!filter,
    });
};
// export const useFilteredJobs = (filter: JobFilter, page = 0, size = 10) => {
//     return useQuery({
//         queryKey: ['filteredJobs', filter, page, size],
//         queryFn: async () => {
//             const res = await axios.post(`${API_URL}/filter?page=${page}&size=${size}`, filter);
//             return res.data; // zakładamy Page<Job>
//         },
//         // keepPreviousData: true,
//     });
// };
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

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await axios.post(`${LOGOUT_URL}/api/auth/logout`);
            document.cookie = `authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`;
        },
        onSuccess: () => {
            toast.success("Logout successful!");
            queryClient.clear();
            window.location.href = "/login";
        },
        onError: (error) => {
            console.error('Logout failed:', error);
        },
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
