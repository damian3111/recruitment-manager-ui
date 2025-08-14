// services/emailService.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/api'; // Assuming this is your axios instance, same as in the job service example

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/email/confirm-email`;

export const useConfirmEmail = (token: string) => {
    return useQuery<string, Error>({
        queryKey: ['emailConfirmation', token],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}?token=${token}`);
            return res.data;
        },
        enabled: !!token, // Only run if token is provided
        retry: false, // No retries for confirmation
        staleTime: Infinity, // Data doesn't go stale
    });
};