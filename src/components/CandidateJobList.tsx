'use client';

import { useEffect, useState } from 'react';
import { JobType, useAllJobs } from '@/lib/jobService';
import { useCurrentUser } from '@/lib/userService';
import { useInvitesByCandidate, useSendInvite, useDeleteInvite } from '@/lib/invitationService';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/icons';

const CandidateJobList = () => {
    const { data: user } = useCurrentUser();
    const { data: jobs, isLoading } = useAllJobs();
    const { data: invites, refetch } = useInvitesByCandidate(user?.id);
    const sendInvite = useSendInvite();
    const deleteInvite = useDeleteInvite();

    const [sentJobIds, setSentJobIds] = useState<number[]>([]);

    useEffect(() => {
        if (invites) {
            const sent = invites
                .filter(inv => inv.status === 'sent')
                .map(inv => inv.job_id);
            setSentJobIds(sent);
        }
    }, [invites]);

    const handleSend = (jobId: number) => {
        if (!user?.id) return;

        sendInvite.mutate(
            {
                candidate_id: user.id,
                job_id: jobId,
                status: 'sent',
            },
            {
                onSuccess: () => {
                    toast.success('✅ Application sent!');
                    setSentJobIds(prev => [...prev, jobId]);
                    refetch();
                },
                onError: () => toast.error('❌ Failed to apply.'),
            }
        );
    };

    const handleCancel = (jobId: number) => {
        const invite = invites?.find(
            inv => inv.status === 'sent' && inv.job_id === jobId && inv.candidate_id === user?.id
        );
        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                toast.success('✅ Application canceled!');
                setSentJobIds(prev => prev.filter(id => id !== jobId));
                refetch();
            },
            onError: () => toast.error('❌ Failed to cancel.'),
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Spinner key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs?.map(job => {
                const isSent = sentJobIds.includes(job.id);
                return (
                    <div
                        key={job.id}
                        className="p-4 bg-white border rounded-2xl shadow-sm flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.description}</p>
                        </div>
                        <Button
                            onClick={() => (isSent ? handleCancel(job.id) : handleSend(job.id))}
                            variant={isSent ? 'destructive' : 'default'}
                        >
                            {isSent ? 'Cancel Application' : 'Apply'}
                        </Button>
                    </div>
                );
            })}
        </div>
    );
};

export default CandidateJobList;
