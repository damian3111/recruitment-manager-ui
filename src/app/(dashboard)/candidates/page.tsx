'use client';

import {CandidateFilter, CandidateType, useFilteredCandidates} from '@/lib/candidatesService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Bookmark, BriefcaseBusiness, MoreVertical} from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirmationModal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import JobSelectModal from "@/components/modals/JobSelectModal";
import { JobType, useJobsByUser } from "@/lib/jobService";
import { useCurrentUser } from "@/lib/userService";
import {useDeleteInvite, useSendInvite} from "@/lib/invitationService";
import CandidateFilters from "@/components/layout/filters/CandidateFilters";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {AnimatePresence, motion} from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CandidatesPage() {
    const { data: user } = useCurrentUser();
    const { data: jobs } = useJobsByUser(user?.id);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [filters, setFilters] = useState<CandidateFilter>({});
    const debouncedFilters = useDebouncedValue(filters, 500);
    const [focusedField, setFocusedField] = useState<keyof CandidateFilter | null>(null);
    const [bookmarkedCandidateIds, setBookmarkedCandidateIds] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const pageSize = 10;
    const { data: candidates, isLoading, isError, error } = useFilteredCandidates(
        debouncedFilters,
        page,
        pageSize,
    );    // const { data, isLoading } = useFilteredCandidates({ filter,w limit });
    const router = useRouter();

    useEffect(() => {
    }, [filters]);

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
                ❌ Error loading candidates: {(error as Error).message}
            </p>
        );
    }
    const toggleBookmark = (candidateId: number) => {
        setBookmarkedCandidateIds(prev =>
            prev.includes(candidateId)
                ? prev.filter(id => id !== candidateId)
                : [...prev, candidateId]
        );
    };

    const handleSendInvitationClick = (candidate: CandidateType) => {
        setSelectedCandidateId(candidate.id);
        setShowConfirm(true);
    };


    return (
        <div className="flex gap-8 p-6 max-w-full ml-2">
            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-2/6 min-w-2x bg-white rounded-2xl shadow-xl p-10 border border-gray-200 sticky top-6"
            >
                <CandidateFilters
                    filters={filters}
                    onChange={v => {
                        setFilters(v);
                        setPage(0);
                    }}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />
            </motion.div>

            {/* Candidates List Section */}
            <div className="flex-1 max-w-[64rem] mx-auto space-y-6">
                {user?.userRole === 'recruited' && <div className="flex justify-end">
                    <Button
                        onClick={() => router.push('/profile')}
                        className="text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Update Profile
                    </Button>
                </div>}
                <AnimatePresence>
                    {candidates?.content?.map((candidate: CandidateType) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card
                                className="w-full p-8 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[12.5rem]"
                            >
                                <div className="relative flex">
                                    {/* Action Buttons: Top-Right Corner */}
                                    <div className="absolute top-0 right-0 flex items-center gap-3">
                                        {user?.userRole !== 'recruited' && (
                                            <>
                                                <Button
                                                    onClick={() => handleSendInvitationClick(candidate)}
                                                    className="ext-base bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                                                >
                                                    I'm Interested
                                                </Button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toggleBookmark(candidate.id)}
                                                    aria-label={
                                                        bookmarkedCandidateIds.includes(candidate.id)
                                                            ? 'Remove bookmark'
                                                            : 'Add bookmark'
                                                    }
                                                >
                                                    <Bookmark
                                                        className="h-6 w-6 transition-colors duration-300"
                                                        stroke={bookmarkedCandidateIds.includes(candidate.id) ? '#FFD700' : '#1F2937'}
                                                        fill={bookmarkedCandidateIds.includes(candidate.id) ? '#FFD700' : 'none'}
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
                                                <Link href={`/candidates/${candidate.id}`}>
                                                    <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                                        View Details
                                                    </DropdownMenuItem>
                                                </Link>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Left Column: Name, Email, Phone */}
                                    <div className="flex-1 space-y-4">
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                            {candidate.headline || 'N/A'}
                                        </h2>
                                        <p className="text-base font-medium text-gray-700">
                                            {candidate.first_name} {candidate.last_name || 'N/A'}
                                        </p>
                                        <p className="text-base text-gray-600">
                                            {candidate.email || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Center Column: Status, Applied At */}
                                    <div className="flex-1 space-y-2">
                                        <p className="text-base font-medium text-gray-700">
                                            <span className="text-blue-600 font-semibold">
                        {candidate.location || 'N/A'}
                      </span>
                                        </p>
                                        <p className="text-base text-gray-600">
                                            Applied at:{' '}
                                            {candidate.applied_date || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {candidates && (
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-4 text-gray-700 font-medium">
              Page {page + 1} of {candidates.totalPages}
            </span>
                        <Button
                            onClick={() => setPage((prev) => Math.min(prev + 1, candidates.totalPages - 1))}
                            disabled={page >= candidates.totalPages - 1}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                )}
                <JobSelectModal
                    open={showConfirm}
                    candidateId={selectedCandidateId!}
                    jobs={jobs ?? []}
                    onCancel={() => setShowConfirm(false)}
                />
            </div>
        </div>
    );
}
