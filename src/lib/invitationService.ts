import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/api';
import {JobType} from "@/lib/jobService";

export type InvitationStatus = 'sent' | 'accepted' | 'declined';

export type InvitationType = {
    id: number;
    recruiter_id: number;
    candidate_id: number;

    job_id: number;
    status: InvitationStatus;
    created_at: string;
};
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const API_URL = `${BACKEND_URL}/invitations`;

export const useInvites = () => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites'],
        queryFn: async () => {
            const res = await axios.get(API_URL);
            return res.data;
        },
        staleTime: 1000 * 60,
    });
};

export const useInvitesByCandidate = (candidateId: number) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'candidate', candidateId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/candidate/${candidateId}`);
            return res.data;
        },
        enabled: !!candidateId,
    });
};

export const useInvitesByCandidateAndRecruiter = (candidateId: number, recruiterId: number) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'candidate-recruiter', candidateId, recruiterId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/by-candidate-and-recruiter`, {
                params: {
                    candidateId,
                    recruiterId,
                },
            });
            return res.data;
        },
        enabled: !!candidateId && !!recruiterId,
    });
};

export const useInvitesByRecruiter = (recruiterId: number) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'recruiter', recruiterId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/recruiter/${recruiterId}`);
            return res.data;
        },
        enabled: !!recruiterId,
    });
};

export const useUserRelatedInvitations = (userId: number, email: string) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'user-related', userId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/user-related`, {
                params: { userId, email },
            });
            return res.data;
        },
        enabled: !!userId && !!email,
    });
};

export const useSendInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (invite: Omit<InvitationType, 'id' | 'created_at'>) => {
            const res = await axios.post(API_URL, invite);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] });
        },
        onError: (err) => {
            console.error('❌ Error sending invite:', err);
        },
    });
};
export const useInvitesByJobUser = (userId: number, email: string) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'job-user', userId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/received-by-recruiter`, {
                params: { userId, email},
            });
            return res.data;
        },
        enabled: !!userId,
    });
};

export const useInvitationsReceivedByRecruited = (userId: number, email: string) => {
    return useQuery<InvitationType[]>({
        queryKey: ['invites', 'recruited', userId],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/received-by-recruited`, {
                params: { userId, email},
            });
            return res.data;
        },
        enabled: !!userId,
    });
};

export const useDeleteInvite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${API_URL}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] });
        },
        onError: (err) => {
            console.error('❌ Error deleting invite:', err);
        },
    });
};
export const useUpdateInviteStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               id,
                               status,
                           }: {
            id: number;
            status: InvitationStatus;
        }) => {
            const res = await axios.patch(`${API_URL}/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invites'] });
        },
        onError: (err) => {
            console.error('❌ Error updating invite status:', err);
        },
    });
};
