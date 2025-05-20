'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    CandidateType,
    useCandidate,
    useCandidateByEmail,
    useCreateCandidate,
    useUpdateCandidate
} from '@/lib/candidatesService';
import * as z from 'zod';
import {useCurrentUser} from "@/lib/userService";
import {useEffect, useState} from "react";
import ConfirmModal from "@/components/confirmationModal"
import TextField from "@/components/TextField";
import TextAreaField from "@/components/TextAreaField";
import {JobType, useJobs, useJobsByUser} from "@/lib/jobService";
import Link from "next/link";

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
    skills: z.string().optional()
});

type CandidateFormType = z.infer<typeof candidateSchema>;

export default function RecruiterProfile() {

    const { data: user } = useCurrentUser();
    const { data: jobs, isLoading, isError } = useJobsByUser(user?.id);


    return (
        <div className="w-full min-h-screen bg-gray-50 p-10">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Listings</h1>

                <div className="text-right mb-6">
                    <Link href="/add-job">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                            Add New Job
                        </button>
                    </Link>
                </div>

                <div>
                    {jobs?.length === 0 ? (
                        <p>No jobs available.</p>
                    ) : (
                        <ul>
                            {jobs?.map((job: JobType) => (
                                <li key={job.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                    <p className="text-gray-600">{job.description}</p>
                                    <p className="text-sm text-gray-500">{job.location}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
