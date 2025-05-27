'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    CandidateType,
    useCandidate,
    useCandidateByEmail,
    useCreateCandidate,
    useUpdateCandidate,
} from '@/lib/candidatesService';
import * as z from 'zod';
import { useCurrentUser } from '@/lib/userService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JobType, useJobsByUser } from '@/lib/jobService';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {Spinner} from "@/components/icons";
import MessagesSettingsPage from "@/components/RoleBasedAccessDeniedPage";
import RoleBasedAccessDeniedPage from "@/components/RoleBasedAccessDeniedPage";


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
    const router = useRouter();

    console.log("user?.userRole");
    console.log(user?.userRole);
    if (user?.userRole !== 'recruiter') {
        return <RoleBasedAccessDeniedPage role={"recruiters"}/>;
    }
    return (
        <div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-6xl mx-auto px-8 py-12 bg-gray-50 min-h-screen"
    >
      <Card className="relative w-full p-12 rounded-xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300"
      >
        <div className="absolute top-6 left-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            aria-label="Go back to previous page"
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 shadow-sm"
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
              <Link href="/add-job">
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
                <Spinner className="w-8 h-8 text-teal-600" />
              </div>
            ) : isError ? (
              <p className="text-red-500 text-center">Error loading jobs</p>
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
                    <Card
                      className="p-6 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-0 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                        <p className="text-base text-gray-600 line-clamp-2">{job.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                            <p><strong>Employment Type:</strong> {job.employment_type || 'N/A'}</p>
                          </div>
                          <div>
                            <p><strong>Salary:</strong> {job.salary_min} - {job.salary_max} {job.currency || 'N/A'}</p>
                            <p><strong>Posted:</strong> {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Link href={`/jobs/${job.id}`}>
                            <Button
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 text-sm font-medium"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
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
