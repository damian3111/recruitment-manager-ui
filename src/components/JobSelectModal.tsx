import React, { useEffect, useState } from 'react';
import { JobType } from '@/lib/jobService';
import {
    useInvitesByCandidate,
    useInvitesByCandidateAndRecruiter,
    useSendInvite,
    useUpdateInviteStatus
} from '@/lib/invitationService';
import { useCurrentUser } from '@/lib/userService';
import toast from 'react-hot-toast';

interface JobSelectModalProps {
    open: boolean;
    jobs: JobType[];
    candidateId: number;
    onCancel: () => void;
}

const JobSelectModal: React.FC<JobSelectModalProps> = ({
                                                           open,
                                                           jobs,
                                                           candidateId,
                                                           onCancel,
                                                       }) => {
    const [sentJobIds, setSentJobIds] = useState<number[]>([]);
    const { data: user } = useCurrentUser();
    const { data: invites, refetch, isFetching } = useInvitesByCandidateAndRecruiter(candidateId, user?.id);
    const sendInvite = useSendInvite();
    const cancelInvite = useUpdateInviteStatus();

    useEffect(() => {
        if (open && invites) {
            const sentIds = invites
                .filter(invite => invite.status === 'sent')
                .flatMap(invite => invite.job_id);
            setSentJobIds(sentIds);
        }
    }, [open, invites]);

    const handleSend = (jobId: number) => {
        if (!user?.id) return;

        sendInvite.mutate(
            {
                recruiter_id: user.id,
                candidate_id: candidateId,
                job_id: jobId,
                status: 'sent',
            },
            {
                onSuccess: () => {
                    setSentJobIds(prev => [...prev, jobId]);
                    toast.success('✅ Invitation sent!');
                    refetch();
                },
                onError: () => toast.error('❌ Failed to send invitation.'),
            }
        );
    };

    const handleCancel = async (jobId: number) => {
        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.jobs.includes(jobId) &&
            inv.candidate_id === candidateId
        );

        if (!invite) return;

        // cancelInvite.mutate(
        //     {
        //         id: invite.id,
        //         status: 'cancelled', // or 'declined' depending on your API
        //     },
        //     {
        //         onSuccess: () => {
        //             setSentJobIds(prev => prev.filter(id => id !== jobId));
        //             toast.success('✅ Invitation canceled!');
        //             refetch();
        //         },
        //         onError: () => toast.error('❌ Failed to cancel invitation.'),
        //     }
        // );
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Manage Invitations
                </h2>
                <div className="space-y-3">
                    {jobs.map((job) => {
                        const isSent = sentJobIds.includes(job.id);
                        return (
                            <div key={job.id} className="flex items-center justify-between">
                                <span className="text-gray-700">{job.title}</span>
                                <button
                                    onClick={() => isSent ? handleCancel(job.id) : handleSend(job.id)}
                                    disabled={isFetching}
                                    className={`px-3 py-1 rounded text-sm transition ${
                                        isFetching ? 'bg-gray-500 text-white hover:bg-red-600' 
                                            :
                                        isSent
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isSent ? 'Cancel Invitation' : 'Send Invitation'}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobSelectModal;
