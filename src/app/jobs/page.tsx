'use client';

import { useJobs } from '@/lib/jobService';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/icons';
import Link from 'next/link';

export default function JobsPage() {
    const { data: jobs, isLoading, isError, error } = useJobs();

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
        <div className="space-y-4">
            {jobs?.map((job) => (
                <Card
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
                        <Link
                            href={`/jobs/${job.id}`}
                            className="text-sm text-blue-500 hover:underline block mt-2"
                        >
                            View details →
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
