'use client';

import { CandidateType, useCandidates, useFilteredCandidates } from '@/lib/candidatesService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/confirmationModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import JobSelectModal from "@/components/JobSelectModal";
import { JobType, useJobsByUser } from "@/lib/jobService";
import { useCurrentUser } from "@/lib/userService";
import { useSendInvite } from "@/lib/invitationService";
import CandidateFilters, { CandidateFilter } from "@/components/CandidateFilters";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function CandidatesPage() {
    const { data: user } = useCurrentUser();
    const { data: jobs } = useJobsByUser(user?.id);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [selectedJobs, setSelectedJobs] = useState<JobType[] | null>(null);
    const sendInvitationMutation = useSendInvite();
    const [filters, setFilters] = useState<CandidateFilter>({});
    const debouncedFilters = useDebouncedValue(filters, 500);
    const [focusedField, setFocusedField] = useState<"first_name" | "last_name">("first_name");

    const { data: candidates, isLoading, isError, error } = useFilteredCandidates(debouncedFilters);

    useEffect(() => {
        // console.log("Filters Updated");
    }, [filters]);

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
                ❌ Error loading candidates: {(error as Error).message}
            </p>
        );
    }

    const handleSendInvitationClick = (candidate: CandidateType) => {
        setSelectedCandidateId(candidate.id);
        setShowConfirm(true);
    };

    return (
        <div className="flex gap-8">
            {/* Filters Section */}
            <div className="w-1/4">
                <CandidateFilters filters={filters} onChange={setFilters} focusedField={focusedField} setFocusedField={setFocusedField}
                />
            </div>

            {/* Candidates List Section */}
            <div className="w-3/4">
                {candidates.content?.map((candidate) => (
                    <Card
                        key={candidate.id}
                        className="w-full p-4 rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <CardContent className="space-y-1">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {candidate.first_name} {candidate.lastName}
                                </h2>
                                <p className="text-sm text-gray-600">{candidate.email}</p>
                                <p className="text-sm text-gray-600">{candidate.phoneNumber}</p>
                                <p className="text-sm font-medium text-gray-700">
                                    Status: <span className="text-blue-600">{candidate.status}</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    Applied at: {new Date(candidate.appliedAt).toLocaleString()}
                                </p>
                            </CardContent>
                            <Button size="sm" onClick={() => handleSendInvitationClick(candidate)}>
                                I'm Interested
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:text-gray-800">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Link href={`/candidates/${candidate.id}`}>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card>
                ))}
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
