'use client';

import {JobType, useJobs} from '@/lib/jobService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {CandidateType, useCandidateByEmail} from "@/lib/candidatesService";
import React, {useEffect, useState} from "react";
import {ConfirmModal} from "@/components/ConfirmModal";
import {useDeleteInvite, useInvitesByCandidateAndRecruiter} from "@/lib/invitationService";
import {useCurrentUser} from "@/lib/userService";
import toast from "react-hot-toast";

export default function JobsPage() {
    const { data: jobs, isLoading, isError, error } = useJobs();
    const [showConfirm, setShowConfirm] = useState(false);
    const { data: user } = useCurrentUser();
    const {data: candidate} = useCandidateByEmail(user?.email);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const { data: invites, refetch, isFetching } = useInvitesByCandidateAndRecruiter(candidate?.id ?? -1, user?.id);
    const [sentJobIds, setSentJobIds] = useState<number[]>([]);
    const deleteInvite = useDeleteInvite();

    useEffect(() => {
        if (invites) {
            const sentIds = invites
                .filter(invite => invite.status === 'sent')
                .flatMap(invite => invite.job_id);
            setSentJobIds(sentIds);
        }
    }, [invites]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Spinner key={i} />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <p className="text-red-500 text-center mt-10">
                ❌ Error loading jobs: {(error as Error).message}
            </p>
        );
    }
    const handleSendInvitationClick = (job: JobType) => {

        setSelectedJobId(job.id);
        // setSelectedJobId(jobId);
        setShowConfirm(true);
    };

    const onSuccess = () => {
        setShowConfirm(false);
    };

    const handleCancel = (jobId: number) => {
        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidate?.id &&
            inv.recruiter_id === user.id
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                setSentJobIds(prev => prev.filter(id => id !== jobId));
                toast.success('✅ Invitation deleted!');
                refetch(); // jeśli potrzebne
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

    return (
        <div className="space-y-4">
            {jobs?.map((job) => {
                const isSent = sentJobIds.includes(job.id);

                return (<Card
                    key={job.id}
                    className="w-full p-4 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
                >
                    <CardContent className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                        <p className="text-sm text-gray-600">Company: {job.company}</p>
                        <p className="text-sm text-gray-600">Location: {job.location}</p>
                        <p className="text-sm font-medium text-gray-700">
                            Status: <span className="text-blue-600">{job.status}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                            Posted: {new Date(job.posted_at).toLocaleDateString()}
                        </p>
                        {/*<Button size="sm" onClick={() => handleSendInvitationClick(job)}>*/}
                        {/*    I'm Interested*/}
                        {/*</Button>*/}
                        <button
                            onClick={() => isSent ? handleCancel(job.id) : handleSendInvitationClick(job)}
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
                        <Link
                            href={`/jobs/${job.id}`}
                            className="text-sm text-blue-500 hover:underline block mt-2"
                        >
                            View details →
                        </Link>
                    </CardContent>
                    <ConfirmModal
                        open={showConfirm}
                        // candidateId={selectedJobId!}
                        jobId={selectedJobId}
                        onSuccess={onSuccess}
                        onCancel={() => setShowConfirm(false)}
                    />
                </Card>
                )})}
        </div>
    );
}
