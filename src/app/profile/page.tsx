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

export default function CandidateForm() {
    const { data: user } = useCurrentUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CandidateFormType>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            first_name: user?.firstName ?? '',
            last_name: user?.lastName ?? '',
            email: user?.email ?? ''
        }
    });

    const [formData, setFormData] = useState<Omit<CandidateType, 'id'> | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const createCandidate = useCreateCandidate();
    const {data: candidate, isLoading, error, refetch} = useCandidateByEmail(user?.email);
    let updateCandidate = useUpdateCandidate();

    useEffect(() => {
        if (user) {
            reset((prev) => ({
                ...prev,
                first_name: user.firstName ?? '',
                last_name: user.lastName ?? '',
                email: user.email ?? ''
            }));
        }
    }, [user, reset]);

    const onSubmit = (data: CandidateFormType) => {
        try {
            const normalizedData: Omit<CandidateType, 'id'> = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone ?? '',
                profile_picture_url: data.profile_picture_url ?? '',
                headline: data.headline ?? '',
                summary: data.summary ?? '',
                experience: data.experience ?? '',
                years_of_experience: data.years_of_experience,
                education: data.education ?? '',
                certifications: data.certifications ?? '',
                work_experiences: data.work_experiences ?? '',
                projects: data.projects ?? '',
                media_url: data.media_url ?? '',
                salary_expectation: data.salary_expectation ?? '',
                work_style: data.work_style,
                applied_date: data.applied_date ?? '',
                location: data.location ?? '',
                skills: data.skills ?? '',
            };
            setFormData(normalizedData);
            setShowConfirm(true);

        } catch (error) {
            toast.error('Please ensure all JSON fields are valid.');
        }
    };

    const confirmAction = () => {
            if (!formData) return;
            const isUpdate = !!candidate?.id;
            const onSuccess = () => {
                toast.success('Candidate profile submitted successfully!');
                refetch();
                setShowConfirm(false);
            };

            const onError = () => {
                toast.error('Failed to submit candidate profile.');
                setShowConfirm(false);
            };

            if (isUpdate && candidate?.id) {
                updateCandidate.mutate({ ...formData, id: candidate.id }, { onSuccess, onError });
            } else {
                createCandidate.mutate(formData, { onSuccess, onError });
            }

            setShowConfirm(false);
        }
    ;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-10">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Candidate Full Profile</h1>
                <h1>{user?.email}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="First Name" {...register('first_name')} disabled />
                        <TextField label="Last Name" {...register('last_name')} disabled />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="Email" type="email" {...register('email')} disabled className="bg-gray-100 cursor-not-allowed" />
                        <TextField label="Phone" {...register('phone')} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="Profile Picture URL" {...register('profile_picture_url')} />
                        <TextField label="Headline" {...register('headline')} placeholder="e.g., Full Stack Developer" />
                    </div>
                    <TextAreaField label="Summary" {...register('summary')} />
                    <TextAreaField label="Experience" {...register('experience')} />
                    <TextField label="Years of Experience" type="number" {...register('years_of_experience', { valueAsNumber: true })} />
                    <TextAreaField label="Education" {...register('education')} />
                    <TextAreaField label="Certifications" {...register('certifications')} />
                    <TextAreaField label="Work Experiences" {...register('work_experiences')} />
                    <TextAreaField label="Projects" {...register('projects')} />
                    <TextField label="Media URL" {...register('media_url')} />
                    <TextField label="Salary Expectation" {...register('salary_expectation')} placeholder="e.g., 5000 EUR/month" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Style</label>
                        <select {...register('work_style')}
                                className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="On-site">On-site</option>
                        </select>
                    </div>
                    <TextField label="Applied Date" type="date" {...register('applied_date')} />
                    <TextField label="Location" {...register('location')} />
                    <TextField label="Skills (comma-separated)" {...register('skills')} />
                    <div className="text-right">
                            <button type="submit"
                                    disabled={createCandidate.isPending || updateCandidate.isPending}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                                {createCandidate.isPending || updateCandidate.isPending ? 'Submitting...' : 'Submit Full Profile'}
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
