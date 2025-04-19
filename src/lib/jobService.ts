import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
import axios from '../utils/api';

export type JobType = {
    id: number;
    title: string;
    description: string;
    location: string;
    salary: number;
};

const API_URL = 'http://localhost:8080/jobs';

export const useJobs = () => {
    return useQuery<JobType[]>({
        queryKey: ['jobs'],
        queryFn: async () => {
            const res = await axios.get("http://localhost:8080/jobs");
            return res.data;
        },
        staleTime: 1000 * 60, // 1 min cache
    });
};

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
