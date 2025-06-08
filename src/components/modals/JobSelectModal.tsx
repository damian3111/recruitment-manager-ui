import React, { useEffect, useState } from 'react';
import { JobType } from '@/lib/jobService';
import {
    useDeleteInvite,
    useSendInvite,
    useUpdateInviteStatus, useUserRelatedInvitations
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
    const [acceptedJobIds, setAcceptedJobIds] = useState<number[]>([]);
    const [receivedJobIds, setReceivedJobIds] = useState<number[]>([]);
    const { data: user } = useCurrentUser();
    const {data: invites, refetch, isFetching  } = useUserRelatedInvitations(user?.id, user?.email);

    const sendInvite = useSendInvite();
    const deleteInvite = useDeleteInvite();
    const { mutate } = useUpdateInviteStatus();

    useEffect(() => {
        if (open && invites) {
            console.log(invites);
            console.log(user?.id);

            const sentIds = invites
                .filter(invite => invite.status === 'sent' && invite.candidate_id == candidateId && invite.recruiter_id == user?.id)
                .flatMap(invite => invite.job_id);
            setSentJobIds(sentIds);

            const acceptedIds = invites
                .filter(invite => invite.status === 'accepted' && invite.candidate_id == candidateId)
                .flatMap(invite => invite.job_id);
            setAcceptedJobIds(acceptedIds);

            const receiverIds = invites
                .filter(invite => invite.status === 'sent' && invite.candidate_id == candidateId && invite.recruiter_id != user?.id)
                .flatMap(invite => invite.job_id);
            setReceivedJobIds(receiverIds);
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
                    toast.success('✅ Invitation Sent!')
                    refetch();
                },
                onError: () => toast.error('❌ Failed to send invitation.'),
            }
        );
    };

    const handleCancel = (jobId: number) => {
        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                setSentJobIds(prev => prev.filter(id => id !== jobId));
                toast.success('✅ Invitation deleted!');
                refetch();
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

    const handleAcceptInvitation = (jobId: number) => {
        console.log("(((((");

        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );
        if (!invite) return;

        mutate({
            id: invite.id,
            status: 'accepted',
        }, {
            onSuccess: () => {
                toast.success('✅ Invitation accepted!');
            },
            onError: () => {
                toast.error('❌ Failed to accept the invitation.');
            },
        });
    };

    const handleRemoveRelation = (jobId: number) => {
        const invite = invites?.find(inv =>
            inv.status === 'accepted' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidateId
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                toast.success('✅ Invitation deleted!');
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
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
                        const isAccepted = acceptedJobIds.includes(job.id);
                        const isReceived = receivedJobIds.includes(job.id);
                        return (
                            <div key={job.id} className="flex items-center justify-between">
                                <span className="text-gray-700">{job.title}</span>
                                <button
                                    onClick={() => isSent ? handleCancel(job.id) : isReceived ? handleAcceptInvitation(job.id) : handleSend(job.id)}
                                    disabled={isFetching || isAccepted}
                                    className={`px-3 py-1 rounded text-sm transition ${
                                        isFetching ? 'bg-gray-500 text-white' 
                                            :
                                        isSent
                                            ? 'bg-red-500 text-white hover:bg-red-600' :
                                        isAccepted 
                                            ? 'bg-gray-500 text-white' : 
                                        isReceived 
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isSent ? 'Cancel Invitation' : isAccepted ? "Invitation Accepted" : isReceived ? "Accept Invitation" : 'Send Invitation'}
                                </button>
                                {isAccepted && <button
                                    onClick={() => handleRemoveRelation(job.id)}
                                    className={`px-3 py-1 rounded text-sm transition bg-blue-600 text-white hover:bg-blue-700`}
                                >
                                    Remove Relation
                                </button>}
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
