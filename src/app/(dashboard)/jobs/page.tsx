'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobType, JobFilter, useFilteredJobs } from '@/lib/jobService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {useCandidateByEmail} from '@/lib/candidatesService';
import ConfirmModal from '@/components/modals/confirmationModal';
import toast from 'react-hot-toast';
import {
    useDeleteInvite,
    useSendInvite,
    useUpdateInviteStatus,
    useUserRelatedInvitations,
} from '@/lib/invitationService';
import { useCurrentUser } from '@/lib/userService';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import JobFilters from "@/components/layout/filters/JobFilters";

export default function JobsPage() {
    const { data: user } = useCurrentUser();
    const { data: candidate, refetch } = useCandidateByEmail(user?.email);
    const { data: invites } = useUserRelatedInvitations(user?.id, user?.email);
    const sendInvite = useSendInvite();
    const deleteInvite = useDeleteInvite();
    const { mutate } = useUpdateInviteStatus();
    const router = useRouter();
    const [filters, setFilters] = useState<JobFilter>({});

    const debouncedFilters = useDebouncedValue(filters, 500);
    const [focusedField, setFocusedField] = useState<keyof JobFilter | null>(null);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
    const [sentJobIds, setSentJobIds] = useState<number[]>([]);
    const [acceptedJobIds, setAcceptedJobIds] = useState<number[]>([]);
    const [receivedJobIds, setReceivedJobIds] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const { data: jobs, isLoading, isError, error } = useFilteredJobs(debouncedFilters, page, pageSize);

    useEffect(() => {
        if (invites) {
            const sentIds = invites
                .filter(
                    (invite) =>
                        invite.status === 'sent' &&
                        invite.candidate_id === candidate?.id &&
                        invite.recruiter_id === user?.id,
                )
                .flatMap((invite) => invite.job_id);
            setSentJobIds(sentIds);

            const acceptedIds = invites
                .filter((invite) => invite.status === 'accepted' && invite.candidate_id === candidate?.id)
                .flatMap((invite) => invite.job_id);
            setAcceptedJobIds(acceptedIds);

            const receivedIds = invites
                .filter(
                    (invite) =>
                        invite.status === 'sent' &&
                        invite.candidate_id === candidate?.id &&
                        invite.recruiter_id !== user?.id,
                )
                .flatMap((invite) => invite.job_id);
            setReceivedJobIds(receivedIds);
        }
    }, [invites, candidate]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 z-50">
                <div className="space-y-4 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mr-28">
                        <Spinner className="w-96 mx-auto" />
                    </div>
                </div>
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
        setBookmarkedJobIds((prev) =>
            prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId],
        );
    };

    const handleSendInvitationClick = (job: JobType) => {
        setSelectedJobId(job.id);
        setShowConfirm(true);
    };

    const handleCancel = (job: JobType) => {
        const invite = invites?.find(
            (inv) => inv.status === 'sent' && inv.job_id === job.id && inv.recruiter_id === user.id,
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                setSentJobIds((prev) => prev.filter((id) => id !== job.id));
                toast.success('✅ Invitation deleted!');
                refetch();
            },
            onError: () => toast.error('❌ Failed to delete invitation.'),
        });
    };

    const handleAcceptInvitation = (jobId: number) => {
        const invite = invites?.find(
            (inv) => inv.status === 'sent' && inv.job_id === jobId && inv.candidate_id === candidate?.id,
        );
        if (!invite) return;

        mutate(
            {
                id: invite.id,
                status: 'accepted',
            },
            {
                onSuccess: () => {
                    toast.success('✅ Invitation accepted!');
                },
                onError: () => {
                    toast.error('❌ Failed to accept the invitation.');
                },
            },
        );
    };

    const handleRemoveRelation = (jobId: number) => {
        const invite = invites?.find(
            (inv) =>
                inv.status === 'accepted' && inv.job_id === jobId && inv.candidate_id === candidate?.id,
        );

        if (!invite) return;

        deleteInvite.mutate(invite.id, {
            onSuccess: () => {
                setSentJobIds((prev) => prev.filter((id) => id !== jobId));
                toast.success('✅ Invitation deleted!');
                refetch();
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
                    setSentJobIds((prev) => [...prev, selectedJobId ?? -1]);
                    toast.success('✅ Application Sent!');
                    refetch();
                    setShowConfirm(false);
                },
                onError: () => toast.error('❌ Failed to send invitation.'),
            },
        );
    };

    return (
        <div className="flex gap-8 p-6 max-w-full ml-2">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-2/6 bg-white rounded-2xl shadow-xl p-10 border border-gray-200 sticky top-6"
            >
                <JobFilters
                    filters={filters}
                    onChange={v => {
                        setFilters(v);
                        setPage(0);
                    }}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />
            </motion.div>

            <div className="flex-1 max-w-[64rem] mx-auto space-y-6">
                {user?.userRole === 'recruiter' && (
                    <div className="flex justify-end">
                        <Button
                            onClick={() => router.push('/profile-jobs')}
                            className="text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Create Job
                        </Button>
                    </div>
                )}
                <AnimatePresence>
                    {jobs?.content?.map((job: JobType) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                className="w-full p-8 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[12.5rem] flex flex-row gap-4"
                            >
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                        {job.title || 'N/A'}
                                    </h2>
                                    <p className="text-base font-medium text-gray-700">
                                        {job.company || 'N/A'}
                                    </p>
                                    <p className="text-base text-gray-600">
                                        {job.location || 'N/A'}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <p className="text-base font-medium text-gray-700">
                                        Salary:{' '}
                                        <span className="text-blue-600 font-semibold">
                                        {job.salary_min && job.salary_max
                                            ? `${job.salary_min} - ${job.salary_max} ${job.currency?.slice(0,15) || ''}`
                                            : 'N/A'}
                                    </span>
                                    </p>
                                    <p className="text-base text-gray-600">
                                        {job.employment_mode || 'N/A'}
                                    </p>
                                </div>

                                <div className="flex-1 flex justify-end items-start">
                                    <div className="flex items-center gap-3">
                                        {user?.userRole !== 'recruiter' && (
                                            <>
                                                {sentJobIds?.includes(job.id) ? (
                                                    <Button
                                                        onClick={() => handleCancel(job)}
                                                        className="text-sm w-36 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                    >
                                                        Submitted
                                                    </Button>
                                                ) : acceptedJobIds?.includes(job.id) ? (
                                                    <div className="flex flex-col gap-2">
                                                        <Button
                                                            onClick={() => handleCancel(job)}
                                                            className="text-sm w-36 cursor-default bg-gray-500 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                                                        >
                                                            Invitation Accepted
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleRemoveRelation(job.id)}
                                                            className="text-sm w-36 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                        >
                                                            Remove Relation
                                                        </Button>
                                                    </div>
                                                ) : receivedJobIds?.includes(job.id) ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcceptInvitation(job.id)}
                                                        className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                                    >
                                                        Accept Invitation
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleSendInvitationClick(job)}
                                                        className="text-sm w-36 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                                                    >
                                                        Apply
                                                    </Button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toggleBookmark(job.id)}
                                                    aria-label={
                                                        bookmarkedJobIds.includes(job.id)
                                                            ? 'Remove bookmark'
                                                            : 'Add bookmark'
                                                    }
                                                >
                                                    <Bookmark
                                                        className="h-6 w-6 transition-colors duration-300"
                                                        stroke={bookmarkedJobIds.includes(job.id) ? '#FFD700' : '#1F2937'}
                                                        fill={bookmarkedJobIds.includes(job.id) ? '#FFD700' : 'none'}
                                                    />
                                                </motion.button>
                                            </>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-1 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                                                    aria-label="More options"
                                                >
                                                    <MoreVertical className="h-6 w-6" />
                                                </motion.button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-white shadow-lg rounded-lg border border-gray-200"
                                            >
                                                <Link href={`/jobs/${job.id}`}>
                                                    <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                                        View Details
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {jobs && (
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-gray-700 font-medium">
                        Page {page + 1} of {jobs.totalPages}
                    </span>
                        <Button
                            onClick={() => setPage((prev) => Math.min(prev + 1, jobs.totalPages - 1))}
                            disabled={page >= jobs.totalPages - 1}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                )}
                <ConfirmModal
                    open={showConfirm}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmAction}
                    description={'Do you really want to apply for this job?'}
                />
            </div>
        </div>
    );
}