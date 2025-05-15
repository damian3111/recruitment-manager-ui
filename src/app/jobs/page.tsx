'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { JobType, useFilteredJobs } from '@/lib/jobService';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import JobFilters, { JobFilter } from '@/components/JobFilters';

export default function JobsPage() {
    const [filters, setFilters] = useState<JobFilter>({});
    const debouncedFilters = useDebouncedValue(filters, 500);
    const [focusedField, setFocusedField] = useState<keyof JobFilter>('title');

    const { data: jobs, isLoading, isError, error } = useFilteredJobs(debouncedFilters);

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
                {jobs.content?.map((job: JobType) => (
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
            </div>
        </div>
    );
}
