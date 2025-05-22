'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {Bookmark, MoreVertical} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { JobType, useFilteredJobs } from '@/lib/jobService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import JobFilters, { JobFilter } from '@/components/JobFilters';
import {CandidateType, useCandidateByEmail} from "@/lib/candidatesService";
import JobSelectModal from "@/components/JobSelectModal";
import ConfirmModal from "@/components/confirmationModal";
import toast from "react-hot-toast";
import {
    useDeleteInvite,
    useInvites,
    useInvitesByRecruiter,
    useSendInvite,
    useUpdateInviteStatus, useUserRelatedInvitations
} from "@/lib/invitationService";
import {useCurrentUser} from "@/lib/userService";

export default function JobsPage() {
    const [filters, setFilters] = useState<JobFilter>({});
    const debouncedFilters = useDebouncedValue(filters, 500);
    const [focusedField, setFocusedField] = useState<keyof JobFilter>('title');
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const sendInvite = useSendInvite();
    const { data: user } = useCurrentUser();
    const {data: candidate, refetch} = useCandidateByEmail(user?.email);
    // const { data: invites } = useInvitesByRecruiter(user?.id);
    const {data: invites} = useUserRelatedInvitations(user?.id, user?.email);

    // const { data: invites } = useInvitesByRecruiter(user?.id)
    const deleteInvite = useDeleteInvite();

    // const { data: jobs, isLoading, isError, error } = useFilteredJobs(debouncedFilters);
    const [sentJobIds, setSentJobIds] = useState<number[]>([]);
    const [acceptedJobIds, setAcceptedJobIds] = useState<number[]>([]);
    const [receivedJobIds, setReceivedJobIds] = useState<number[]>([]);
    const { mutate } = useUpdateInviteStatus();
    const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const { data: jobs, isLoading, isError, error } = useFilteredJobs(debouncedFilters, page, pageSize);

    useEffect(() => {
        if (invites) {
            const sentIds = invites
                .filter(invite => invite.status === 'sent' && invite.candidate_id == candidate?.id && invite.recruiter_id == user?.id)
                .flatMap(invite => invite.job_id);
            setSentJobIds(sentIds);

            const acceptedIds = invites
                .filter(invite => invite.status === 'accepted' && invite.candidate_id == candidate?.id)
                .flatMap(invite => invite.job_id);
            setAcceptedJobIds(acceptedIds);

            const receivedIds = invites
                .filter(invite => invite.status === 'sent' && invite.candidate_id == candidate?.id && invite.recruiter_id != user?.id)
                .flatMap(invite => invite.job_id);
            setReceivedJobIds(receivedIds);
        }

    }, [invites, candidate]);

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
    const toggleBookmark = (jobId: number) => {
        setBookmarkedJobIds(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };
    const handleSendInvitationClick = (job: JobType) => {
        setSelectedJobId(job.id);
        setShowConfirm(true);
    };

    const handleCancel = (job: JobType) => {
        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === job.id &&
            inv.recruiter_id === user.id
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                setSentJobIds(prev => prev.filter(id => id !== job.id));
                toast.success('✅ Invitation deleted!');
                refetch(); // jeśli potrzebne
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

    const handleAcceptInvitation = (jobId: number) => {
        console.log("(((((");

        const invite = invites?.find(inv =>
            inv.status === 'sent' &&
            inv.job_id === jobId &&
            inv.candidate_id === candidate?.id
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
            inv.candidate_id === candidate?.id
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
    const confirmAction = () => {
        sendInvite.mutate(
            {
                recruiter_id: user.id,
                candidate_id: candidate?.id ?? -1,
                job_id: selectedJobId ?? -1,
                status: 'sent',
            },
            {
                onSuccess: () => {
                    setSentJobIds(prev => [...prev, selectedJobId ?? -1]);
                    toast.success('✅ Invitation sent!');
                    refetch();
                    setShowConfirm(false);
                },
                onError: () => toast.error('❌ Failed to send invitation.'),
            }
        );
    };

    return (
        <div className="flex gap-8">
            {/* Filters */}
            <div className="w-1/4">
                <JobFilters
                    filters={filters}
                    onChange={setFilters}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />
            </div>

            {/* Job Cards */}
            <div className="w-3/4 space-y-4">
                {jobs?.content?.map((job: JobType) => (
                    <Card
                        key={job.id}
                        className="w-full p-4 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <CardContent className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                                <p className="text-sm text-gray-600">{job.description}</p>
                                <p className="text-sm font-medium text-gray-700">
                                    Salary: <span className="text-green-600">{job.salary} PLN</span>
                                </p>
                                    <p className="text-xs text-gray-400">
                                    Created at: {new Date(job.createdAt).toLocaleString()}
                                </p>
                            </CardContent>
                            {user?.userRole !== 'recruiter' && (
                                <div className="flex items-center gap-2">
                                    {sentJobIds?.includes(job.id) ? (
                                        <Button size="sm" onClick={() => handleCancel(job)}>
                                            Sent
                                        </Button>
                                    ) : acceptedJobIds?.includes(job.id) ? (
                                        <div>
                                            <Button size="sm" onClick={() => handleCancel(job)}>
                                                Invitation Accepted
                                            </Button>
                                            <Button
                                                onClick={() => handleRemoveRelation(job.id)}
                                                className={`px-3 py-1 rounded text-sm transition bg-red-500 text-white hover:bg-red-600`}
                                            >
                                                Remove Relation
                                            </Button>
                                        </div>
                                        ) : receivedJobIds?.includes(job.id) ? (
                                            <Button size="sm" onClick={() => handleAcceptInvitation(job.id)}>
                                                Accept Invitation
                                            </Button>
                                        ) : (
                                        <Button size="sm" onClick={() => handleSendInvitationClick(job)}>
                                            I'm Interested
                                        </Button>
                                    )}
                                    <button onClick={() => toggleBookmark(job.id)}>
                                        <Bookmark
                                            className="h-6 w-6 transition-colors duration-300"
                                            stroke={bookmarkedJobIds.includes(job.id) ? "gold" : "black"}
                                            fill={bookmarkedJobIds.includes(job.id) ? "gold" : "none"}
                                        />
                                    </button>
                                </div>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:text-gray-800">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <Link href={`/jobs/${job.id}`}>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </Card>
                ))}
                {jobs && (
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-2">
      Page {page + 1} of {jobs.totalPages}
    </span>
                        <Button
                            onClick={() => setPage(prev => Math.min(prev + 1, jobs.totalPages - 1))}
                            disabled={page >= jobs.totalPages - 1}
                        >
                            Next
                        </Button>
                    </div>
                )}
                <ConfirmModal
                    open={showConfirm}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmAction}
                />
            </div>
        </div>
    );
}
