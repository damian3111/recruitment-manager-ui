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
import {motion} from "framer-motion";
import {ArrowLeft} from "lucide-react";

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

const tagRender = (props: { value?: string; label?: string; onClose: () => void }) => {
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
                proficiencyLevel: z.string().optional(),
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
        return newSkills;
    };

    const handleSelect = (
        value: string,
        currentSkills: { name: string; proficiencyLevel?: string }[]
    ) => {
        const { name, proficiencyLevel } = decodeSkill(value);
        if (!name) return currentSkills;

        // Remove any existing entry for this skill
        const updatedSkills = currentSkills.filter((s) => s.name !== name);

        // Add new entry
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
        <div className="w-full min-h-screen bg-gray-50 p-10">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-10">
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        aria-label="Go back to previous page"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 shadow-sm"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-700" />
                    </motion.button>

                    <h1 className="text-3xl font-bold text-gray-800">Post a New Job</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <TextField
                        label="Job Title"
                        {...register('title')}
                        error={errors.title?.message}
                    />
                    <TextAreaField
                        label="Description"
                        {...register('description')}
                        error={errors.description?.message}
                    />
                    <TextAreaField
                        label="Requirements"
                        {...register('requirements')}
                        error={errors.requirements?.message}
                    />
                    <TextAreaField
                        label="Responsibilities"
                        {...register('responsibilities')}
                        error={errors.responsibilities?.message}
                    />
                    {/*<TextField*/}
                    {/*    label="Employment Type (Full-time, Part-time...)"*/}
                    {/*    {...register('employment_type')}*/}
                    {/*    error={errors.employment_type?.message}*/}
                    {/*/>*/}
                    <div>
                        <Label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Employment Type
                        </Label>
                        <select
                            {...register('employment_type')}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                        <Label htmlFor="employment_mode" className="block text-sm font-medium text-gray-700 mb-1">
                            Employment Mode
                        </Label>
                        <select
                            {...register('employment_mode')}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Salary Min"
                            type="number"
                            {...register('salary_min')}
                            error={errors.salary_min?.message}
                        />
                        <TextField
                            label="Salary Max"
                            type="number"
                            {...register('salary_max')}
                            error={errors.salary_max?.message}
                        />
                    </div>
                    <TextField
                        label="Currency (e.g. USD, EUR, PLN)"
                        {...register('currency')}
                        error={errors.currency?.message}
                    />
                    <div>
                        <Label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-1">
                            Employment Mode
                        </Label>
                        <select
                            {...register('experience_level')}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                    {/*<TextField*/}
                    {/*    label="Experience Level (Entry, Mid, Senior...)"*/}
                    {/*    {...register('experience_level')}*/}
                    {/*    error={errors.experience_level?.message}*/}
                    {/*/>*/}
                    <TextField
                        label="Industry"
                        {...register('industry')}
                        error={errors.industry?.message}
                    />
                    <TextField
                        label="Company Name"
                        {...register('company_name')}
                        error={errors.company_name?.message}
                    />
                    <TextAreaField
                        label="Benefits (Optional)"
                        {...register('benefits')}
                        error={errors.benefits?.message}
                    />
                    <div>
                        <Label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                            Required Skills
                        </Label>
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
                        <button
                            type="submit"
                            disabled={createJob.isPending || updateJob.isPending}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                        >
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