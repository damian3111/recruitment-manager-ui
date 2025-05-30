'use client';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import toast from "react-hot-toast";
import {
    useDeleteInvite,
    useInvitesByCandidate,
    useInvitesByCandidateAndRecruiter,
    useSendInvite,
    useUpdateInviteStatus
} from '@/lib/invitationService';

import {useState} from "react";
import {useCurrentUser} from "@/lib/userService";
import {useCandidateByEmail} from "@/lib/candidatesService";
type ConfirmModalProps = {
    open: boolean;
    title?: string;
    jobId: number | null;
    description?: string;
    onCancel: () => void;
    onSuccess: () => void;
};

export function ConfirmModal({
                                 open,
                                 title = 'Are you sure?',
                                 description = 'Do you want to send an invitation?',
                                 onCancel,
                                 onSuccess,
                                 jobId
                             }: ConfirmModalProps) {

    const [sentJobIds, setSentJobIds] = useState<number[]>([]);
    const { data: user } = useCurrentUser();
// const { data: invites, refetch, isFetching } = useInvitesByCandidateAndRecruiter(candidateId, user?.id);
    const sendInvite = useSendInvite();
    const cancelInvite = useUpdateInviteStatus();
    const deleteInvite = useDeleteInvite();
    const {data: candidate, isLoading, error, refetch} = useCandidateByEmail(user?.email);

    console.log(user);
    const handleSend = () => {
        toast.success('✅ Application Sent!');

        // if (!user?.id) return;
        //
        if (!candidate) return;

        sendInvite.mutate(
            {
                recruiter_id: user.id,
                candidate_id: candidate.id,
                job_id: jobId ?? -1,
                status: 'sent',
            },
            {
                onSuccess: () => {
                    // setSentJobIds(prev => [...prev, jobId]);
                    toast.success('✅ Application Sent!')
                    onSuccess();
                },
                onError: () => toast.error('❌ Failed to send invitation.'),
            }
        );


    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{description}</p>
                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend}>Yes, Send</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
