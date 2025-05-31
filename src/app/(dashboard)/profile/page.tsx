'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TreeSelect as AntTreeSelect } from 'antd';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import {
    CandidateType,
    useCandidateByEmail,
    useCreateCandidate,
    useUpdateCandidate,
} from '@/lib/candidatesService';
import { useCurrentUser } from '@/lib/userService';
import ConfirmModal from '@/components/confirmationModal';
import TextField from '@/components/TextField';
import TextAreaField from '@/components/TextAreaField';
import RoleBasedAccessDeniedPage from '@/components/RoleBasedAccessDeniedPage';
import {CustomTagProps} from "rc-select/es/BaseSelect";

// Proficiency levels from CandidateFilters
const PROFICIENCY_LEVELS = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Familiar', label: 'Familiar' },
    { value: 'Good', label: 'Good' },
    { value: 'Expert', label: 'Expert' },
];

// Generate treeData with proficiency levels
const generateTreeDataWithProficiency = (baseTreeData: any[]) => {
    return baseTreeData.map((category) => ({
        ...category,
        checkable: false,
        children: category.children.map((skill: { title: string; value: string }) => ({
            title: skill.title,
            value: skill.value,
            checkable: false,
            selectable: true, // Allow selecting skill without proficiency
            children: PROFICIENCY_LEVELS.map((prof) => ({
                title: prof.label,
                value: `${skill.value}:${prof.value}`,
            })),
        })),
    }));
};

const treeData = generateTreeDataWithProficiency([
    {
        title: 'Technologies',
        value: 'technologies',
        selectable: false,
        children: [
            { title: 'React', value: 'react' },
            { title: 'Angular', value: 'angular' },
            { title: 'Vue.js', value: 'vue.js' },
            { title: 'Node.js', value: 'node.js' },
            { title: 'Django', value: 'django' },
            { title: 'Spring Boot', value: 'spring boot' },
            { title: 'Docker', value: 'docker' },
            { title: 'Kubernetes', value: 'kubernetes' },
            { title: 'AWS', value: 'aws' },
            { title: 'Azure', value: 'azure' },
            { title: 'Terraform', value: 'terraform' },
            { title: 'GraphQL', value: 'graphql' },
        ],
    },
    {
        title: 'Programming Languages',
        value: 'programming-languages',
        selectable: false,
        children: [
            { title: 'JavaScript', value: 'javascript' },
            { title: 'TypeScript', value: 'typescript' },
            { title: 'Python', value: 'python' },
            { title: 'Java', value: 'java' },
            { title: 'C#', value: 'C#' },
            { title: 'Go', value: 'go' },
            { title: 'Rust', value: 'rust' },
            { title: 'Kotlin', value: 'kotlin' },
            { title: 'Swift', value: 'swift' },
            { title: 'PHP', value: 'php' },
            { title: 'Ruby', value: 'ruby' },
        ],
    },
    {
        title: 'Languages',
        value: 'languages',
        selectable: false,
        children: [
            { title: 'English', value: 'english' },
            { title: 'Spanish', value: 'spanish' },
            { title: 'Mandarin', value: 'mandarin' },
            { title: 'German', value: 'german' },
            { title: 'French', value: 'french' },
            { title: 'Japanese', value: 'japanese' },
        ],
    },
    {
        title: 'Soft Skills',
        value: 'soft-skills',
        selectable: false,
        children: [
            { title: 'Communication', value: 'communication' },
            { title: 'Teamwork', value: 'teamwork' },
            { title: 'Problem Solving', value: 'problem solving' },
            { title: 'Adaptability', value: 'adaptability' },
            { title: 'Time Management', value: 'time management' },
            { title: 'Leadership', value: 'leadership' },
            { title: 'Critical Thinking', value: 'critical thinking' },
        ],
    },
    {
        title: 'Hard Skills',
        value: 'hard-skills',
        selectable: false,
        children: [
            { title: 'Database Management', value: 'database management' },
            { title: 'Cybersecurity', value: 'cybersecurity' },
            { title: 'Cloud Computing', value: 'cloud computing' },
            { title: 'DevOps', value: 'devops' },
            { title: 'Machine Learning', value: 'machine-learning' },
            { title: 'Data Analysis', value: 'data analysis' },
            { title: 'API Development', value: 'api development' },
            { title: 'UI/UX Design', value: 'ui/ux design' },
            { title: 'Network Administration', value: 'network administration' },
        ],
    },
]);

const encodeSkill = (name: string, proficiency?: string) => proficiency ? `${name}:${proficiency}` : name;
const decodeSkill = (value: string) => {
    if (!value.includes(':')) {
        return { name: value, proficiencyLevel: undefined };
    }
    const [name, proficiencyLevel] = value.split(':');
    return { name, proficiencyLevel };
};

const tagRender = (props: CustomTagProps) => {
    const { value, onClose } = props;
    return (
        <div
            style={{
                margin: '2px', padding: '2px 8px',
                background: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <span>{value}</span>
            <span
                onClick={onClose}
                style={{ marginLeft: '8px', cursor: 'pointer', color: '#000000' }}
            >
                        ×
                        </span>
        </div>
    );
};
const suffix = (count: number) => (
    <>
        <span>{count}</span>
    </>
);

// Schema with skills as { name: string; proficiencyLevel?: string }[]
const candidateSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    profile_picture_url: z.string().url('Invalid URL').optional(),
    headline: z.string().optional(),
    summary: z.string().optional(),
    experience: z.string().optional(),
    years_of_experience: z
        .number()
        .min(0, 'Years of experience cannot be negative')
        .max(50, 'Years of experience cannot exceed 50'),
    education: z.string().optional(),
    certifications: z.string().optional(),
    work_experiences: z.string().optional(),
    projects: z.string().optional(),
    media_url: z.string().url('Invalid URL').optional(),
    salary_expectation: z.string().optional(),
    work_style: z.enum(['Remote', 'Hybrid', 'On-site']),
    applied_date: z.string().optional(),
    location: z.string().optional(),
    skills: z
        .array(
            z.object({
                name: z.string(),
                proficiencyLevel: z.string().optional(),
            })
        )
        .optional(),
});

type CandidateFormType = z.infer<typeof candidateSchema>;

export default function CandidateForm() {
    const { data: user } = useCurrentUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm<CandidateFormType>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            work_style: 'Remote',
            skills: [],
        },
    });

    const skills = watch('skills'); // Watch skills for suffix count
    const [formData, setFormData] = useState<Omit<CandidateType, 'id'> | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const createCandidate = useCreateCandidate();
    const updateCandidate = useUpdateCandidate();
    const { data: candidate, isLoading, error, refetch } = useCandidateByEmail(user?.email);
    const router = useRouter();

    const isSkillNode = (value: string) => !value.includes(':');
    const getProficiencyNodes = (skillValue: string) => {
        return PROFICIENCY_LEVELS.map((prof) => encodeSkill(skillValue, prof.value));
    };

    const handleSkillsChange = (selectedValues: string[]) => {
        const expandedValues: string[] = [];
        selectedValues.forEach((value) => {
            if (isSkillNode(value)) {
                expandedValues.push(value); // Add skill without proficiency
            } else {
                expandedValues.push(value); // Add skill with proficiency
            }
        });

        const uniqueValues = Array.from(new Set(expandedValues));
        const newSkills = uniqueValues.map(decodeSkill).filter((s) => s.name);

        return newSkills // Limit to 3 skills
    };

    const handleSelect = (
        values: string[], // Changed from string to string[]
        currentSkills: { name: string; proficiencyLevel?: string }[],
    ) => {
        let updatedSkills = [...currentSkills];

        values.forEach((value) => {
            const { name, proficiencyLevel } = decodeSkill(value);
            if (!name) return;

            // Remove any existing entry for this skill
            updatedSkills = updatedSkills.filter((s) => s.name !== name);

            // Add new entry
            updatedSkills.push({ name, proficiencyLevel });
        });

        // Enforce max 3 skills
        return updatedSkills.slice(0, 3);
    };

    // Updated handleDeselect to accept string[]
    const handleDeselect = (
        values: string[], // Changed from string to string[]
        currentSkills: { name: string; proficiencyLevel?: string }[],
    ) => {
        let updatedSkills = [...currentSkills];

        values.forEach((value) => {
            if (isSkillNode(value)) {
                // Remove skill node (e.g., 'javascript')
                updatedSkills = updatedSkills.filter((s) => s.name !== value);
            } else {
                // Remove specific proficiency (e.g., 'javascript:Beginner')
                const { name, proficiencyLevel } = decodeSkill(value);
                updatedSkills = updatedSkills.filter(
                    (s) =>
                        !(s.name === name && s.proficiencyLevel === proficiencyLevel),
                );
            }
        });

        return updatedSkills;
    };

    useEffect(() => {
        if (user) {
            reset((prev) => ({
                ...prev,
                first_name: user.firstName ?? '',
                last_name: user.lastName ?? '',
                email: user.email ?? '',
            }));
        }
    }, [user, reset]);

    useEffect(() => {
        if (candidate) {
            const validWorkStyle = ['Remote', 'Hybrid', 'On-site'].includes(candidate.work_style)
                ? candidate.work_style
                : 'Remote';
            let parsedSkills: { name: string; proficiencyLevel?: string }[] = [];
            try {
                parsedSkills = candidate.skills ? candidate.skills : [];
            } catch (e) {
                console.error('Failed to parse skills:', e);
            }

            reset({
                first_name: candidate.first_name,
                last_name: candidate.last_name,
                email: candidate.email,
                phone: candidate.phone ?? '',
                profile_picture_url: candidate.profile_picture_url ?? '',
                headline: candidate.headline ?? '',
                summary: candidate.summary ?? '',
                experience: candidate.experience ?? '',
                years_of_experience: candidate.years_of_experience ?? 0,
                education: candidate.education ?? '',
                certifications: candidate.certifications ?? '',
                work_experiences: candidate.work_experiences ?? '',
                projects: candidate.projects ?? '',
                media_url: candidate.media_url ?? '',
                salary_expectation: candidate.salary_expectation ?? '',
                work_style: validWorkStyle,
                applied_date: candidate.applied_date ?? '',
                location: candidate.location ?? '',
                skills: parsedSkills,
            });
        }
    }, [candidate, reset]);

    const onSubmit = (data: CandidateFormType) => {
        console.log("asdsaddas");
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
                skills: data.skills ?? [],
            };
            setFormData(normalizedData);
            setShowConfirm(true);
        } catch (error) {
            toast.error('Form submission error. Please check your inputs.');
        }
    };

    const confirmAction = () => {
        console.log("sd");
        if (!formData) return;
        const isUpdate = !!candidate?.id;
        const onSuccess = () => {
            toast.success('Candidate profile submitted successfully!');
            refetch();
            setShowConfirm(false);
            router.push('/profile');
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
    };

    if (user?.userRole !== 'recruited') {
        return <RoleBasedAccessDeniedPage role="candidates" />;
    }

    return (
        <div className="">
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

                    <CardContent className="p-6 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-gradient-to-r from-teal-50 to-gray-50 p-6 rounded-xl"
                        >
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Candidate Full Profile</h1>
                            <p className="text-lg text-gray-600 mt-2">Complete your profile to showcase your skills and experience</p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="first_name" className="block text-base font-semibold text-gray-900 mb-2">First Name</Label>
                                    <TextField
                                        id="first_name"
                                        label="First Name"
                                        {...register('first_name')}
                                        error={errors.first_name?.message}
                                        disabled
                                        className="w-full px-5 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="last_name" className="block text-base font-semibold text-gray-900 mb-2">Last Name</Label>
                                    <TextField
                                        id="last_name"
                                        label="Last Name"
                                        {...register('last_name')}
                                        error={errors.last_name?.message}
                                        disabled
                                        className="w-full px-5 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">Email</Label>
                                    <TextField
                                        id="email"
                                        label="Email"
                                        type="email"
                                        {...register('email')}
                                        error={errors.email?.message}
                                        disabled
                                        className="w-full px-5 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="block text-base font-semibold text-gray-900 mb-2">Phone</Label>
                                    <TextField
                                        id="phone"
                                        label="Phone Number"
                                        {...register('phone')}
                                        error={errors.phone?.message}
                                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="profile_picture_url" className="block text-base font-semibold text-gray-900 mb-2">Profile Picture URL</Label>
                                    <TextField
                                        id="profile_picture_url"
                                        label="Profile Picture"
                                        {...register('profile_picture_url')}
                                        error={errors.profile_picture_url?.message}
                                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="headline" className="block text-base font-semibold text-gray-900 mb-2">Headline</Label>
                                    <TextField
                                        id="headline"
                                        label="Headline"
                                        {...register('headline')}
                                        error={errors.headline?.message}
                                        placeholder="e.g., Full Stack Developer"
                                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="summary" className="block text-base font-semibold text-gray-900 mb-2">Summary</Label>
                                <TextAreaField
                                    id="summary"
                                    label="Summary"
                                    {...register('summary')}
                                    error={errors.summary?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience" className="block text-base font-semibold text-gray-900 mb-2">Experience</Label>
                                <TextAreaField
                                    id="experience"
                                    label="Experience"
                                    {...register('experience')}
                                    error={errors.experience?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="years_of_experience" className="block text-base font-semibold text-gray-900 mb-2">Years of Experience</Label>
                                <TextField
                                    id="years_of_experience"
                                    label="Years of Experience"
                                    type="number"
                                    {...register('years_of_experience', { valueAsNumber: true })}
                                    error={errors.years_of_experience?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="education" className="block text-base font-semibold text-gray-900 mb-2">Education</Label>
                                <TextAreaField
                                    id="education"
                                    label="Education"
                                    {...register('education')}
                                    error={errors.education?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="certifications" className="block text-base font-semibold text-gray-900 mb-2">Certifications</Label>
                                <TextAreaField
                                    id="certifications"
                                    label="Certifications"
                                    {...register('certifications')}
                                    error={errors.certifications?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="work_experiences" className="block text-base font-semibold text-gray-900 mb-2">Work Experiences</Label>
                                <TextAreaField
                                    id="work_experiences"
                                    label="Work Experience"
                                    {...register('work_experiences')}
                                    error={errors.work_experiences?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="projects" className="block text-base font-semibold text-gray-900 mb-2">Projects</Label>
                                <TextAreaField
                                    id="projects"
                                    label="Projects"
                                    {...register('projects')}
                                    error={errors.projects?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="media_url" className="block text-base font-semibold text-gray-900 mb-2">Media URL</Label>
                                <TextField
                                    id="media_url"
                                    label="Media URL"
                                    {...register('media_url')}
                                    error={errors.media_url?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="salary_expectation" className="block text-base font-semibold text-gray-900 mb-2">Salary Expectation</Label>
                                <TextField
                                    id="salary_expectation"
                                    label="Salary Expectations"
                                    {...register('salary_expectation')}
                                    error={errors.salary_expectation?.message}
                                    placeholder="e.g., 5000 EUR/month"
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="work_style" className="block text-base font-semibold text-gray-900 mb-2">Work Style</Label>
                                <Controller
                                    name="work_style"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || ''}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 text-md focus:ring-teal-500 outline-none text-gray-700"
                                            >
                                                <SelectValue placeholder="Select work style" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white shadow-xl rounded-xl border border-gray-200">
                                                <SelectItem
                                                    value="Remote"
                                                    className="px-4 py-2 text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                                                >
                                                    Remote
                                                </SelectItem>
                                                <SelectItem
                                                    value="Hybrid"
                                                    className="px-4 py-2 text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                                                >
                                                    Hybrid
                                                </SelectItem>
                                                <SelectItem
                                                    value="On-site"
                                                    className="px-4 py-2 text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                                                >
                                                    On-site
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.work_style && (
                                    <p className="text-red-500 text-sm mt-1">{errors.work_style.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="applied_date" className="block text-base font-semibold text-gray-900 mb-2">Applied Date</Label>
                                <TextField
                                    id="applied_date"
                                    label="Applied Date"
                                    type="date"
                                    {...register('applied_date')}
                                    error={errors.applied_date?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location" className="block text-base font-semibold text-gray-900 mb-2">Location</Label>
                                <TextField
                                    id="location"
                                    label="Location"
                                    {...register('location')}
                                    error={errors.location?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="skills" className="block text-base font-semibold text-gray-900 mb-2">Skills</Label>
                                <Controller
                                    name="skills"
                                    control={control}
                                    render={({ field }) => (
                                        <AntTreeSelect
                                            id="skills"
                                            treeData={treeData}
                                            value={
                                                field.value?.filter((s) => s.name).map((s) => encodeSkill(s.name, s.proficiencyLevel)) || []
                                            }
                                            onChange={(selectedValues) => {
                                                const newSkills = handleSkillsChange(selectedValues);
                                                field.onChange(newSkills);
                                            }}
                                            onSelect={(value) => {
                                                const newSkills = handleSelect(value, field.value || []);
                                                field.onChange(newSkills);
                                            }}
                                            onDeselect={(value) => {
                                                const newSkills = handleDeselect(value, field.value || []);
                                                field.onChange(newSkills);
                                            }}
                                            tagRender={tagRender}
                                            multiple
                                            style={{ width: '100%' }}
                                            suffixIcon={suffix(skills?.length || 0)}
                                            treeCheckable
                                            placeholder="Select up to 3 IT skills with or without proficiency"
                                            showCheckedStrategy={AntTreeSelect.SHOW_CHILD}
                                            className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                            dropdownStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                                            treeNodeLabelProp="title"
                                            filterTreeNode={(input: string, treeNode: any) =>
                                                treeNode.title.toLowerCase().includes(input.toLowerCase())
                                            }
                                        />
                                    )}
                                />
                                {errors.skills && (
                                    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <Button
                                    type="submit"
                                    disabled={createCandidate.isPending || updateCandidate.isPending}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md text-base font-semibold"
                                >
                                    {createCandidate.isPending || updateCandidate.isPending ? 'Submitting...' : 'Submit Full Profile'}
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