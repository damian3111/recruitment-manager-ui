'use client';

import { useJobs} from '@/lib/jobService';
import { useEffect } from 'react';

export default function JobsPage() {
    const { data: jobs, isLoading, isError, error } = useJobs();

    if (isLoading) return <p className="text-gray-500">⏳ Loading jobs...</p>;
    if (isError) return <p className="text-red-600">❌ Error: {(error as Error).message}</p>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">📋 Job Listings</h1>
            <ul className="space-y-4">
                {jobs?.map((job) => (
                    <li
                        key={job.id}
                        className="p-4 border rounded-xl shadow hover:bg-gray-50 transition"
                    >
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                        <p className="text-gray-700">{job.description}</p>
                        <p className="text-sm text-gray-500">
                            {job.location} • 💰 {job.salary} PLN
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    );
}
