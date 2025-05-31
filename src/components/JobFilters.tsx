'use client';

import { JobFilter } from '@/lib/jobService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { TreeSelect as AntTreeSelect } from 'antd';
import { BaseSelectRef } from 'rc-select';
import { CustomTagProps } from 'rc-select/es/BaseSelect';

const PROFICIENCY_LEVELS = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Familiar', label: 'Familiar' },
    { value: 'Good', label: 'Good' },
    { value: 'Expert', label: 'Expert' },
];

const generateTreeDataWithProficiency = (baseTreeData: any[]) => {
    return baseTreeData.map((category) => ({
        ...category,
        checkable: false,
        children: category.children.map((skill: { title: string; value: string }) => ({
            title: skill.title,
            value: skill.value,
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
            { title: 'Vue.js', value: 'vuejs' },
            { title: 'Node.js', value: 'nodejs' },
            { title: 'Django', value: 'django' },
            { title: 'Spring Boot', value: 'spring-boot' },
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
            { title: 'C#', value: 'csharp' },
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
            { title: 'Problem Solving', value: 'problem-solving' },
            { title: 'Adaptability', value: 'adaptability' },
            { title: 'Time Management', value: 'time-management' },
            { title: 'Leadership', value: 'leadership' },
            { title: 'Critical Thinking', value: 'critical-thinking' },
        ],
    },
    {
        title: 'Hard Skills',
        value: 'hard-skills',
        selectable: false,
        children: [
            { title: 'Database Management', value: 'database-management' },
            { title: 'Cybersecurity', value: 'cybersecurity' },
            { title: 'Cloud Computing', value: 'cloud-computing' },
            { title: 'DevOps', value: 'devops' },
            { title: 'Machine Learning', value: 'machine-learning' },
            { title: 'Data Analysis', value: 'data-analysis' },
            { title: 'API Development', value: 'api-development' },
            { title: 'UI/UX Design', value: 'ui-ux-design' },
            { title: 'Network Administration', value: 'network-administration' },
        ],
    },
]);

type Props = {
    filters: JobFilter;
    onChange: (filters: JobFilter) => void;
    focusedField: keyof JobFilter | null;
    setFocusedField: (field: keyof JobFilter | null) => void;
};

export default function JobFilters({
                                       filters,
                                       onChange,
                                       focusedField,
                                       setFocusedField,
                                   }: Props) {
    const refs = {
        title: useRef<HTMLInputElement | null>(null),
        location: useRef<HTMLInputElement | null>(null),
        salary_min: useRef<HTMLInputElement | null>(null),
        salary_max: useRef<HTMLInputElement | null>(null),
        company_name: useRef<HTMLInputElement | null>(null),
        posted_date: useRef<HTMLInputElement | null>(null),
        application_deadline: useRef<HTMLInputElement | null>(null),
        currency: useRef<HTMLInputElement | null>(null),
        employment_type: useRef<HTMLInputElement | null>(null),
        employment_mode: useRef<HTMLInputElement | null>(null),
        industry: useRef<HTMLInputElement | null>(null),
        experience_level: useRef<HTMLInputElement | null>(null),
        skills: useRef<BaseSelectRef | null>(null),
    };

    useEffect(() => {
        if (focusedField === 'skills') {
            refs.skills.current?.focus();
        } else if (focusedField !== null) {
            refs[focusedField]?.current?.focus?.();
        }
    }, [focusedField]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof JobFilter
    ) => {
        setFocusedField(field);
        onChange({
            ...filters,
            [field]:
                field === 'salary_min' || field === 'salary_max'
                    ? e.target.value
                        ? +e.target.value
                        : undefined
                    : e.target.value || undefined,
        });
    };

    const handleSelectChange = (value: string, field: keyof JobFilter) => {
        setFocusedField(field);
        onChange({
            ...filters,
            [field]: value || undefined,
        });
    };

    const encodeSkill = (name: string, proficiency: string) => {
        return `${name}:${proficiency}`;
    };

    const decodeSkill = (value: string) => {
        const [name, proficiencyLevel] = value.split(':');
        return { name, proficiencyLevel };
    };

    const isSkillNode = (value: string) => {
        return !value.includes(':');
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

                        const getProficiencyNodes = (skillValue: string) => {
                        return PROFICIENCY_LEVELS.map((prof) => encodeSkill(skillValue, prof.value));
                    };

                        const handleSkillsChange = (selectedValues: string[]) => {
                        setFocusedField('skills');

                        const expandedValues: string[] = [];
                        selectedValues.forEach((value) => {
                        if (isSkillNode(value)) {
                        expandedValues.push(...getProficiencyNodes(value));
                    } else {
                        expandedValues.push(value);
                    }
                    });

                        const uniqueValues = Array.from(new Set(expandedValues));
                        const newSkills = uniqueValues.map((value) => decodeSkill(value));

                        onChange({
                        ...filters,
                        skills: newSkills.length > 0 ? newSkills : undefined,
                    });
                    };

                        const handleSelect = (values: string[], option: any) => {
                        setFocusedField('skills');
                        const currentSkills = filters.skills || [];
                        let updatedSkills = [...currentSkills];

                        values.forEach((value) => {
                        if (isSkillNode(value)) {
                        const newProficiencies = PROFICIENCY_LEVELS.map((prof) => ({
                        name: value,
                        proficiencyLevel: prof.value,
                    }));
                        updatedSkills = [
                        ...updatedSkills.filter((s) => s.name !== value),
                        ...newProficiencies,
                        ];
                    } else {
                        const { name, proficiencyLevel } = decodeSkill(value);
                        if (!name || !proficiencyLevel) return;
                        updatedSkills = [
                        ...updatedSkills.filter(
                        (s) => s.name !== name || s.proficiencyLevel !== proficiencyLevel,
                        ),
                    { name, proficiencyLevel },
                        ];
                    }
                    });

                        onChange({
                        ...filters,
                        skills: updatedSkills.length > 0 ? updatedSkills : undefined,
                    });
                    };

                        const handleDeselect = (values: string[], option: any) => {
                        setFocusedField('skills');
                        let updatedSkills = filters.skills || [];

                        values.forEach((value) => {
                        if (isSkillNode(value)) {
                        updatedSkills = updatedSkills.filter((s) => s.name !== value);
                    } else {
                        const { name, proficiencyLevel } = decodeSkill(value);
                        updatedSkills = updatedSkills.filter(
                        (s) => s.name !== name || s.proficiencyLevel !== proficiencyLevel,
                        );
                    }
                    });

                        onChange({
                        ...filters,
                        skills: updatedSkills.length > 0 ? updatedSkills : undefined,
                    });
                    };

                        const suffix = (
                        <>
                        <span>{filters.skills?.length || 0}</span>
    </>
    );
    return (
        <div className="space-y-6">
            <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-xl font-semibold text-gray-900 tracking-tight"
            >
                Filter Jobs
            </motion.h3>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            >
                <Label htmlFor="title" className="block text-base font-semibold text-gray-900 mb-2">
                    Title
                </Label>
                <Input
                    id="title"
                    ref={refs.title}
                    value={filters.title || ''}
                    onChange={(e) => handleInputChange(e, 'title')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter job title"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
            >
                <Label
                    htmlFor="company_name"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Company Name
                </Label>
                <Input
                    id="company_name"
                    ref={refs.company_name}
                    value={filters.company_name || ''}
                    onChange={(e) => handleInputChange(e, 'company_name')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter company name"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            >
                <Label htmlFor="location" className="block text-base font-semibold text-gray-900 mb-2">
                    Location
                </Label>
                <Input
                    id="location"
                    ref={refs.location}
                    value={filters.location || ''}
                    onChange={(e) => handleInputChange(e, 'location')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter location"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
                className="flex gap-4"
            >
                <div className="flex-1">
                    <Label
                        htmlFor="salary_min"
                        className="block text-base font-semibold text-gray-900 mb-2"
                    >
                        Min Salary
                    </Label>
                    <Input
                        id="salary_min"
                        type="number"
                        ref={refs.salary_min}
                        value={filters.salary_min ?? ''}
                        onChange={(e) => handleInputChange(e, 'salary_min')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                        placeholder="Min"
                    />
                </div>
                <div className="flex-1">
                    <Label
                        htmlFor="salary_max"
                        className="block text-base font-semibold text-gray-900 mb-2"
                    >
                        Max Salary
                    </Label>
                    <Input
                        id="salary_max"
                        type="number"
                        ref={refs.salary_max}
                        value={filters.salary_max ?? ''}
                        onChange={(e) => handleInputChange(e, 'salary_max')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                        placeholder="Max"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            >
                <Label htmlFor="currency" className="block text-base font-semibold text-gray-900 mb-2">
                    Currency
                </Label>
                <Input
                    id="currency"
                    ref={refs.currency}
                    value={filters.currency || ''}
                    onChange={(e) => handleInputChange(e, 'currency')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="e.g., PLN, USD"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 }}
            >
                <Label
                    htmlFor="employment_type"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Employment Type
                </Label>
                <Input
                    id="employment_type"
                    ref={refs.employment_type}
                    value={filters.employment_type || ''}
                    onChange={(e) => handleInputChange(e, 'employment_type')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="e.g., Full-time, Part-time"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
            >
                <Label htmlFor="industry" className="block text-base font-semibold text-gray-900 mb-2">
                    Industry
                </Label>
                <Input
                    id="industry"
                    ref={refs.industry}
                    value={filters.industry || ''}
                    onChange={(e) => handleInputChange(e, 'industry')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="e.g., Technology, Finance"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
            >
                <Label
                    htmlFor="experience_level"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Experience Level
                </Label>
                <Input
                    id="experience_level"
                    ref={refs.experience_level}
                    value={filters.experience_level || ''}
                    onChange={(e) => handleInputChange(e, 'experience_level')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="e.g., Junior, Senior"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
            >
                <Label
                    htmlFor="employment_mode"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Employment Mode
                </Label>
                <Select
                    value={filters.employment_mode || ''}
                    onValueChange={(val) => handleSelectChange(val, 'employment_mode')}
                >
                    <SelectTrigger className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300">
                        <SelectValue placeholder="Select employment mode" />
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
                            value="Onsite"
                            className="px-4 py-2 text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                        >
                            Onsite
                        </SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.55 }}
            >
                <Label
                    htmlFor="posted_date"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Posted Date
                </Label>
                <Input
                    id="posted_date"
                    type="date"
                    ref={refs.posted_date}
                    value={filters.posted_date || ''}
                    onChange={(e) => handleInputChange(e, 'posted_date')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }}
            >
                <Label
                    htmlFor="application_deadline"
                    className="block text-base font-semibold text-gray-900 mb-2"
                >
                    Application Deadline
                </Label>
                <Input
                    id="application_deadline"
                    type="date"
                    ref={refs.application_deadline}
                    value={filters.application_deadline || ''}
                    onChange={(e) => handleInputChange(e, 'application_deadline')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.75 }}
            >
                <Label htmlFor="skills" className="block text-base font-semibold text-gray-900 mb-2">
                    Skills
                </Label>
                <AntTreeSelect
                    id="skills"
                    ref={refs.skills}
                    treeData={treeData}
                    value={
                        filters?.skills
                            ?.filter((s) => s.name && s.proficiencyLevel)
                            .map((s) => encodeSkill(s.name, s.proficiencyLevel)) || []
                    }
                    onChange={handleSkillsChange}
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
                    tagRender={tagRender}
                    multiple
                    style={{ width: '100%' }}
                    suffixIcon={suffix}
                    treeCheckable
                    placeholder="Select up to 3 IT skills with proficiency"
                    showCheckedStrategy={AntTreeSelect.SHOW_CHILD}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    dropdownStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                    treeNodeLabelProp="title"
                    filterTreeNode={(input: string, treeNode: any) =>
                        treeNode.title.toLowerCase().includes(input.toLowerCase())
                    }
                />
            </motion.div>
        </div>
    );
}