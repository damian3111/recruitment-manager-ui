'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useState } from 'react';
import * as z from 'zod';
import { TreeSelect as AntTreeSelect } from 'antd';
import { Label } from '@/components/ui/label';
import TextField from '@/components/TextField';
import TextAreaField from '@/components/TextAreaField';
import ConfirmModal from '@/components/confirmationModal';
import {
    useCreateJob,
    useUpdateJob,
    JobType
} from '@/lib/jobService';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { CustomTagProps } from 'rc-select/es/BaseSelect';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
            selectable: true,
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
                margin: '2px',
                padding: '2px 8px',
                background: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <span>{value ?? 'Unknown'}</span>
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
    <span>{count}</span>
);

const jobSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    description: z.string().min(1, 'Description is required'),
    requirements: z.string().min(1, 'Requirements are required'),
    responsibilities: z.string().min(1, 'Responsibilities are required'),
    employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship']),
    employment_mode: z.enum(['Onsite', 'Remote', 'Hybrid']),
    location: z.string().min(1, 'Location is required'),
    salary_min: z.coerce.number().min(0, 'Salary minimum cannot be negative'),
    salary_max: z.coerce.number().min(0, 'Salary maximum cannot be negative'),
    currency: z.string().min(1, 'Currency is required'),
    experience_level: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
    industry: z.string().min(1, 'Industry is required'),
    company_name: z.string().min(1, 'Company name is required'),
    benefits: z.string().optional(),
    skills: z
        .array(
            z.object({
                name: z.string(),
                proficiencyLevel: z.string(),
            })
        )
        .optional(),
});

type JobFormType = z.infer<typeof jobSchema>;

export default function JobForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm<JobFormType>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: '',
            description: '',
            requirements: '',
            responsibilities: '',
            employment_type: 'Full-time',
            employment_mode: 'Remote',
            location: '',
            salary_min: 0,
            salary_max: 0,
            currency: '',
            experience_level: 'Junior',
            industry: '',
            company_name: '',
            benefits: '',
            skills: [],
        },
    });

    const skills = watch('skills'); // Watch skills for suffix count
    const createJob = useCreateJob();
    const updateJob = useUpdateJob();
    const [formData, setFormData] = useState<Omit<JobType, 'id'> | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const isSkillNode = (value: string) => !value.includes(':');

    const handleSkillsChange = (
        value: string, // Single selected value (e.g., "java:Expert")
        currentSkills: { name: string; proficiencyLevel?: string }[]
    ): { name: string; proficiencyLevel?: string }[] => {
        if (!value || isSkillNode(value)) {
            // Ignore empty values or skill nodes without proficiency (e.g., "javascript")
            return currentSkills;
        }

        const { name, proficiencyLevel } = decodeSkill(value);
        if (!name || !proficiencyLevel) {
            return currentSkills;
        }

        // Remove any existing skill with the same name to enforce single proficiency
        const updatedSkills = currentSkills.filter((s) => s.name !== name);
        updatedSkills.push({ name, proficiencyLevel });
        return updatedSkills;
    };

    const handleSelect = (
        value: string, // Single selected value (e.g., "java:Expert")
        currentSkills: { name: string; proficiencyLevel?: string }[]
    ): { name: string; proficiencyLevel?: string }[] => {
        if (isSkillNode(value)) {
            // Ignore skill nodes without proficiency (e.g., "javascript")
            return currentSkills;
        }

        const { name, proficiencyLevel } = decodeSkill(value);
        if (!name || !proficiencyLevel) {
            return currentSkills;
        }

        // Remove any existing skill with the same name
        const updatedSkills = currentSkills.filter((s) => s.name !== name);
        // Add new skill with proficiency
        updatedSkills.push({ name, proficiencyLevel });
        return updatedSkills;
    };

    const handleDeselect = (value: string, currentSkills: { name: string; proficiencyLevel?: string }[]) => {
        if (isSkillNode(value)) {
            return currentSkills.filter((s) => s.name !== value);
        }
        const { name, proficiencyLevel } = decodeSkill(value);
        return currentSkills.filter((s) => s.name !== name || s.proficiencyLevel !== proficiencyLevel);
    };

    const onSubmit = (data: JobFormType) => {
        try {
            const normalizedData: Omit<JobType, 'id'> = {
                ...data,
                benefits: data.benefits ?? '',
                company: '',
                skills: data.skills ?? [],
            };
            setFormData(normalizedData);
            setShowConfirm(true);
        } catch (err) {
            toast.error('Form submission error.');
        }
    };

    const confirmAction = () => {
        if (!formData) return;

        const onSuccess = () => {
            toast.success('Job posted successfully!');
            reset();
            setShowConfirm(false);
        };

        const onError = () => {
            toast.error('Failed to post job.');
            setShowConfirm(false);
        };

        createJob.mutate(formData, { onSuccess, onError });
    };

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
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Post a New Job</h1>
                            <p className="text-lg text-gray-600 mt-2">Create a job listing to attract the best talent</p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <Label htmlFor="title" className="block text-base font-semibold text-gray-900 mb-2">Job Title</Label>
                                <TextField
                                    id="title"
                                    {...register('title')}
                                    error={errors.title?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="block text-base font-semibold text-gray-900 mb-2">Description</Label>
                                <TextAreaField
                                    id="description"
                                    {...register('description')}
                                    error={errors.description?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="requirements" className="block text-base font-semibold text-gray-900 mb-2">Requirements</Label>
                                <TextAreaField
                                    id="requirements"
                                    {...register('requirements')}
                                    error={errors.requirements?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="responsibilities" className="block text-base font-semibold text-gray-900 mb-2">Responsibilities</Label>
                                <TextAreaField
                                    id="responsibilities"
                                    {...register('responsibilities')}
                                    error={errors.responsibilities?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="employment_type" className="block text-base font-semibold text-gray-900 mb-2">Employment Type</Label>
                                <select
                                    id="employment_type"
                                    {...register('employment_type')}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
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
                                <Label htmlFor="employment_mode" className="block text-base font-semibold text-gray-900 mb-2">Employment Mode</Label>
                                <select
                                    id="employment_mode"
                                    {...register('employment_mode')}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                >
                                    <option value="Onsite">Onsite</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                                {errors.employment_mode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employment_mode.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="location" className="block text-base font-semibold text-gray-900 mb-2">Location</Label>
                                <TextField
                                    id="location"
                                    {...register('location')}
                                    error={errors.location?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="salary_min" className="block text-base font-semibold text-gray-900 mb-2">Salary Minimum</Label>
                                    <TextField
                                        id="salary_min"
                                        type="number"
                                        {...register('salary_min')}
                                        error={errors.salary_min?.message}
                                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="salary_max" className="block text-base font-semibold text-gray-900 mb-2">Salary Maximum</Label>
                                    <TextField
                                        id="salary_max"
                                        type="number"
                                        {...register('salary_max')}
                                        error={errors.salary_max?.message}
                                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="currency" className="block text-base font-semibold text-gray-900 mb-2">Currency</Label>
                                <TextField
                                    id="currency"
                                    {...register('currency')}
                                    error={errors.currency?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="experience_level" className="block text-base font-semibold text-gray-900 mb-2">Experience Level</Label>
                                <select
                                    id="experience_level"
                                    {...register('experience_level')}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
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
                            <div>
                                <Label htmlFor="industry" className="block text-base font-semibold text-gray-900 mb-2">Industry</Label>
                                <TextField
                                    id="industry"
                                    {...register('industry')}
                                    error={errors.industry?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="company_name" className="block text-base font-semibold text-gray-900 mb-2">Company Name</Label>
                                <TextField
                                    id="company_name"
                                    {...register('company_name')}
                                    error={errors.company_name?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="benefits" className="block text-base font-semibold text-gray-900 mb-2">Benefits (Optional)</Label>
                                <TextAreaField
                                    id="benefits"
                                    {...register('benefits')}
                                    error={errors.benefits?.message}
                                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                                />
                            </div>
                            <div>
                                <Label htmlFor="skills" className="block text-base font-semibold text-gray-900 mb-2">Required Skills</Label>
                                <Controller
                                    name="skills"
                                    control={control}
                                    render={({ field }) => (
                                        <AntTreeSelect
                                            id="skills"
                                            treeData={treeData}
                                            // @ts-ignore
                                            value={
                                                field.value?.filter((s) => s.name).map((s) => encodeSkill(s.name, s.proficiencyLevel)) || []
                                            }
                                            onChange={(value: string) => {
                                                const newSkills = handleSkillsChange(value, field.value || []);
                                                field.onChange(newSkills);
                                            }}
                                            onSelect={(value: string) => {
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
                                            placeholder="Select required skills with or without proficiency"
                                            showCheckedStrategy={AntTreeSelect.SHOW_CHILD}
                                            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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