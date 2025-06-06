import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
import axios from '../utils/api';

export type JobType = {
    id: number;
    title: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    currency?: string;
    company: string;
    employment_type: "Full-time" | "Part-time" | "Contract" | "Temporary" | "Internship";
    experience_level: "Junior" | "Mid" | "Senior" | "Lead";
    industry?: string;
    benefits?: string;
    employment_mode?: "Remote" | "Hybrid" | "Onsite";
    remote?: boolean;
    posted_date?: string;
    application_deadline?: string;
    user_id?: string;
    skills?: { name: string; proficiencyLevel: string }[];
};

export type JobFilter = {
    title?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    company_name?: string;
    posted_date?: string;
    application_deadline?: string;
    currency?: string;
    employment_type?: string;
    employment_mode?: string;
    industry?: string;
    experience_level?: string;
    skills?: { name: string; proficiencyLevel: string }[];
}
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`;

export const useJobs = () => {
    return useQuery<JobType[]>({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}`);
            return res.data;
        },
        staleTime: 1000 * 60,
    });
};

// export const useFilteredJobs = (filter: JobFilter) => {
//     return useQuery<JobType[]>({
//         queryKey: ['jobs', 'filter', filter],
//         queryFn: async () => {
//             const res = await axios.post(`${API_URL}/filter`, filter);
//             return res.data;
//         },
//         staleTime: 1000 * 60,
//         enabled: !!filter,
//     });
// };
export const useFilteredJobs = (filter: JobFilter, page = 0, size = 10) => {
    return useQuery({
        queryKey: ['filteredJobs', filter, page, size],
        queryFn: async () => {
            const res = await axios.post(`${API_URL}/filter?page=${page}&size=${size}`, filter);
            return res.data; // zakładamy Page<Job>
        },
        // keepPreviousData: true,
    });
};

export const useJobsByUser = (userId: number) => {
    return useQuery<JobType[]>({
        queryKey: ['jobs', userId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/user/${userId}`);
            return res.data;
        },
        enabled: !!userId, // only run if userId is provided
        staleTime: 1000 * 60,
    });
};
//
export const useJob = (id: number) => {
    return useQuery<JobType>({
        queryKey: ['job', id],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newJob: Omit<JobType, 'id'>) => {
            const res = await axios.post(`${API_URL}`, newJob);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: (err) => {
            console.error('❌ Error creating job:', err);
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (job: JobType) => {
            const res = await axios.put(`${API_URL}/${job.id}`, job);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: (err) => {
            console.error('❌ Error updating job:', err);
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${API_URL}/${id}`);
        },
        onMutate: async (id: number) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['jobs'] });

            const previousJobs = queryClient.getQueryData<JobType[]>(['jobs']);

            queryClient.setQueryData<JobType[]>(['jobs'], (old = []) =>
                old.filter((job) => job.id !== id)
            );

            return { previousJobs };
        },
        onError: (err, id, context) => {
            console.error('❌ Error deleting job:', err);
            // Rollback on error
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
};
