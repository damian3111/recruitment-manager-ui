'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import TextField from '@/components/TextField';
import TextAreaField from '@/components/TextAreaField';
import ConfirmModal from '@/components/confirmationModal';
import {
    useCreateJob,
    useUpdateJob,
    JobType
} from '@/lib/jobService';

const jobSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    requirements: z.string().min(1),
    responsibilities: z.string().min(1),
    employment_type: z.string().min(1),
    employment_mode: z.enum(['Onsite', 'Remote', 'Hybrid']),
    location: z.string(),
    salary_min: z.coerce.number().min(0),
    salary_max: z.coerce.number().min(0),
    currency: z.string().min(1),
    experience_level: z.string(),
    industry: z.string(),
    company_name: z.string().min(1),
    benefits: z.string().optional()
});

type JobFormType = z.infer<typeof jobSchema>;

export default function JobForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<JobFormType>({
        resolver: zodResolver(jobSchema)
    });

    const createJob = useCreateJob();
    const updateJob = useUpdateJob();
    const [formData, setFormData] = useState<Omit<JobType, 'id'> | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = (data: JobFormType) => {
        try {
            setFormData({
                ...data,
                benefits: data.benefits ?? '',
            });
            setShowConfirm(true);
        } catch (err) {
            toast.error('Form submission error.');
        }
    };

    const confirmAction = () => {
        if (!formData) return;

        // const isUpdate = false; // extend this if editing is needed

        const onSuccess = () => {
            toast.success('Job posted successfully!');
            reset();
            setShowConfirm(false);
        };

        const onError = () => {
            toast.error('Failed to post job.');
            setShowConfirm(false);
        };

        // if (isUpdate) {
        //     updateJob.mutate({ ...formData, id: 1 }, { onSuccess, onError });
        // } else {
            createJob.mutate(formData, { onSuccess, onError });
        // }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-10">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Post a New Job</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <TextField label="Job Title" {...register('title')} />
                    <TextAreaField label="Description" {...register('description')} />
                    <TextAreaField label="Requirements" {...register('requirements')} />
                    <TextAreaField label="Responsibilities" {...register('responsibilities')} />
                    <TextField label="Employment Type (Full-time, Part-time...)" {...register('employment_type')} />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Mode</label>
                        <select {...register('employment_mode')}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="Onsite">Onsite</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <TextField label="Location" {...register('location')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="Salary Min" type="number" {...register('salary_min')} />
                        <TextField label="Salary Max" type="number" {...register('salary_max')} />
                    </div>
                    <TextField label="Currency (e.g. USD, EUR, PLN)" {...register('currency')} />
                    <TextField label="Experience Level (Entry, Mid, Senior...)" {...register('experience_level')} />
                    <TextField label="Industry" {...register('industry')} />
                    <TextField label="Company Name" {...register('company_name')} />
                    <TextAreaField label="Benefits (Optional)" {...register('benefits')} />

                    <div className="text-right">
                        <button type="submit"
                                disabled={createJob.isPending || updateJob.isPending}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                            {createJob.isPending || updateJob.isPending ? 'Submitting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
            <ConfirmModal
                open={showConfirm}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmAction}
            />
        </div>
    );
}
