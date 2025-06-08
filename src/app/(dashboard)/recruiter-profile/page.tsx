'use client';

import * as z from 'zod';
import { useCurrentUser } from '@/lib/userService';
import { useRouter } from 'next/navigation';
import React from 'react';
import { JobType, useJobsByUser } from '@/lib/jobService';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Spinner } from '@/components/icons';
import RoleBasedAccessDeniedPage from '@/components/RoleBasedAccessDeniedPage';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const candidateSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    profile_picture_url: z.string().url().optional(),
    headline: z.string().optional(),
    summary: z.string().optional(),
    experience: z.string().optional(),
    years_of_experience: z.number().min(0).max(50),
    education: z.string().optional(),
    certifications: z.string().optional(),
    work_experiences: z.string().optional(),
    projects: z.string().optional(),
    media_url: z.string().url().optional(),
    salary_expectation: z.string().optional(),
    work_style: z.enum(['Remote', 'Hybrid', 'On-site']),
    applied_date: z.string().optional(),
    location: z.string().optional(),
    skills: z.string().optional(),
});

export default function RecruiterProfile() {
    const { data: user } = useCurrentUser();
    const { data: jobs, isLoading, isError } = useJobsByUser(user?.id);
    const router = useRouter();

    if (user && user?.userRole !== 'recruiter') {
        return <RoleBasedAccessDeniedPage role="recruiters" />;
    }

    if (isLoading || !jobs) {
        return    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 z-50">
            <div className="space-y-4 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center mr-28">
                    <Spinner className="w-96 mx-auto" />
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-[74rem] mx-auto px-4 py-6"
            >
                <Card className="relative w-full p-12 rounded-3xl shadow-xl border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-6 left-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.back()}
                            aria-label="Go back to previous page"
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 shadow-sm"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-700" />
                        </motion.button>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-right"
                    >
                        <Link href="/profile-jobs">
                            <Button
                                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md text-base font-semibold"
                            >
                                Add New Job
                            </Button>
                        </Link>
                    </motion.div>
                    <CardContent className="p-6 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-gradient-to-r from-teal-50 to-gray-50 p-8 rounded-xl"
                        >
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Job Listings</h1>
                            <p className="text-lg text-gray-600 mt-2">Manage your posted job openings</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="space-y-6"
                        >
                            {isLoading ? (
                                <div className="flex justify-center">
                                    <Spinner className="w-10 h-10 text-teal-600" />
                                </div>
                            ) : isError ? (
                                <p className="text-red-500 text-center text-lg">Error loading jobs</p>
                            ) : jobs?.length === 0 ? (
                                <p className="text-gray-600 text-center text-lg">No jobs available. Create a new job posting to get started.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {jobs?.map((job: JobType) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.4 + jobs.indexOf(job) * 0.1 }}
                                        >
                                            <Card className="w-full p-8 rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[12.5rem]">
                                                <div className="relative flex gap-6">
                                                    <div className="absolute top-0 right-0 flex items-center gap-3">
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
                                                                    <DropdownMenuItem className="text-gray-700 text-base hover:bg-gray-100 transition-colors duration-200">
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                                                            {job.title || 'N/A'}
                                                        </h2>
                                                        <p className="text-base text-gray-600 line-clamp-2">
                                                            {job.description || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Employment Type: {job.employment_type || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            <span className="text-blue-600 font-semibold">
                                                                {job.salary_min && job.salary_max
                                                                    ? `${job.salary_min} - ${job.salary_max} ${job.currency || ''}`
                                                                    : 'N/A'}
                                                            </span>
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Posted:{' '}
                                                            {job.posted_date
                                                                ? new Date(job.posted_date).toLocaleDateString()
                                                                : 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Location: {job.location || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}