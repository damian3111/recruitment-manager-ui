'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import TextField from '@/components/TextField';
import TextAreaField from '@/components/TextAreaField';
import ConfirmModal from '@/components/confirmationModal';
import { useCurrentUser } from '@/lib/userService';
import { useCreateJob, useUpdateJob, JobType } from '@/lib/jobService';

const jobSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    description: z.string().min(1, 'Description is required'),
    requirements: z.string().min(1, 'Requirements are required'),
    responsibilities: z.string().min(1, 'Responsibilities are required'),
    employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']),
    employment_mode: z.enum(['Onsite', 'Remote', 'Hybrid']),
    location: z.string().min(1, 'Location is required'),
    salary_min: z.coerce.number().min(0, 'Salary minimum must be at least 0'),
    salary_max: z.coerce.number().min(0, 'Salary maximum must be at least 0'),
    currency: z.string().min(1, 'Currency is required'),
    experience_level: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
    industry: z.string().min(1, 'Industry is required'),
    company_name: z.string().min(1, 'Company name is required'),
    benefits: z.string().optional(),
});

type JobFormType = z.infer<typeof jobSchema>;

export default function JobForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<JobFormType>({
        resolver: zodResolver(jobSchema),
    });

    const createJob = useCreateJob();
    const updateJob = useUpdateJob();
    const [formData, setFormData] = useState<Omit<JobType, 'id'> | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const { data: user } = useCurrentUser();
    const router = useRouter();

    const onSubmit = (data: JobFormType) => {
        try {
            setFormData({
                ...data,
                benefits: data.benefits ?? '',
                company: data.company_name ?? '',
            });
            setShowConfirm(true);
        } catch (err) {
            if (err instanceof Error) {
                toast.error(`Form submission error: ${err.message}`);
            } else {
                toast.error('Form submission error');
            }
        }
    };

    const confirmAction = () => {
        if (!user) {
            toast.error('User not authenticated');
            setShowConfirm(false);
            return;
        }

        if (!formData) return;

        const onSuccess = () => {
            toast.success('Job posted successfully!');
            reset();
            setShowConfirm(false);
            router.push('/recruiter-profile');
        };

        const onError = () => {
            toast.error('Failed to post job');
            setShowConfirm(false);
        };

        createJob.mutate({ ...formData, user_id: user?.id }, { onSuccess, onError });
    };

    return (
        <div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-[64rem] mx-auto px-4 py-6"
            >
                <Card className="relative w-full p-12 rounded-3xl shadow-xl border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300">
                    {/* Back Button */}
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

                    <CardContent className="p-6 space-y-8">
                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-gradient-to-r from-teal-50 to-gray-50 p-8 rounded-xl"
                        >
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Post a New Job</h1>
                            <p className="text-lg text-gray-600 mt-2">Create a job listing to attract top talent</p>
                        </motion.div>

                        {/* Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <TextField
                                label="Job Title"
                                {...register('title')}
                                error={errors.title?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <TextAreaField
                                label="Description"
                                {...register('description')}
                                error={errors.description?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <TextAreaField
                                label="Requirements"
                                {...register('requirements')}
                                error={errors.requirements?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <TextAreaField
                                label="Responsibilities"
                                {...register('responsibilities')}
                                error={errors.responsibilities?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            {/*<TextField*/}
                            {/*    label="Employment Type (e.g., Full-time, Part-time)"*/}
                            {/*    {...register('employment_type')}*/}
                            {/*    error={errors.employment_type?.message}*/}
                            {/*    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"*/}
                            {/*/>*/}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Type</label>
                                <select
                                    {...register('employment_type')}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-700"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Temporary">Temporary</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                {errors.employment_type && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employment_type.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Mode</label>
                                <select
                                    {...register('employment_mode')}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-700"
                                >
                                    <option value="Onsite">Onsite</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                {errors.employment_mode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employment_mode.message}</p>
                                )}
                            </div>
                            <TextField
                                label="Location"
                                {...register('location')}
                                error={errors.location?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    label="Salary Minimum"
                                    type="number"
                                    {...register('salary_min')}
                                    error={errors.salary_min?.message}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                <TextField
                                    label="Salary Maximum"
                                    type="number"
                                    {...register('salary_max')}
                                    error={errors.salary_max?.message}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <TextField
                                label="Currency (e.g., USD, EUR, PLN)"
                                {...register('currency')}
                                error={errors.currency?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            {/*<TextField*/}
                            {/*    label="Experience Level (e.g., Entry, Mid, Senior)"*/}
                            {/*    {...register('experience_level')}*/}
                            {/*    error={errors.experience_level?.message}*/}
                            {/*    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"*/}
                            {/*/>*/}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Level</label>
                                <select
                                    {...register('experience_level')}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-700"
                                >
                                    <option value="Junior">Junior</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead">Lead</option>
                                </select>
                                {errors.experience_level && (
                                    <p className="text-red-500 text-sm mt-1">{errors.experience_level.message}</p>
                                )}
                            </div>
                            <TextField
                                label="Industry"
                                {...register('industry')}
                                error={errors.industry?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <TextField
                                label="Company Name"
                                {...register('company_name')}
                                error={errors.company_name?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <TextAreaField
                                label="Benefits (Optional)"
                                {...register('benefits')}
                                error={errors.benefits?.message}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                            <div className="text-right">
                                <Button
                                    type="submit"
                                    disabled={createJob.isPending || updateJob.isPending}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md text-base font-semibold"
                                >
                                    {createJob.isPending || updateJob.isPending ? 'Submitting...' : 'Post Job'}
                                </Button>
                            </div>
                        </motion.form>
                    </CardContent>
                </Card>
                <ConfirmModal
                    open={showConfirm}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={confirmAction}
                />
            </motion.div>
        </div>

    );
}