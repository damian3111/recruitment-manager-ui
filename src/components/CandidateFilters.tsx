'use client';

import { CandidateFilter } from '@/lib/candidatesService';
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
import {BaseSelectRef} from "rc-select";
import {CustomTagProps} from "rc-select/es/BaseSelect";

// Maximum number of selectable skill-proficiency pairs
const PROFICIENCY_LEVELS = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Familiar', label: 'Familiar' },

    { value: 'Good', label: 'Good' },
    { value: 'Expert', label: 'Expert' },
];

// Transform treeData to include proficiency levels
const generateTreeDataWithProficiency = (baseTreeData: any[]) => {
    return baseTreeData.map((category) => ({
        ...category,
        checkable: false, // Make sections unclickable (no checkbox)
        children: category.children.map((skill: { title: string; value: string }) => ({
            title: skill.title,
            value: skill.value, // Parent skill node
            // selectable: true, // Allow selecting skill nodes (optional, controlled by logic)
            children: PROFICIENCY_LEVELS.map((prof) => ({
                title: prof.label,
                value: `${skill.value}:${prof.value}`, // e.g., "java:Expert"
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
    filters: CandidateFilter;
    onChange: (filters: CandidateFilter) => void;
    focusedField: keyof CandidateFilter | null;
    setFocusedField: (field: keyof CandidateFilter) => void;
};

export default function CandidateFilters({
                                             filters,
                                             onChange,
                                             focusedField,
                                             setFocusedField,
                                         }: Props) {
    const refs = {
        first_name: useRef<HTMLInputElement>(null),
        last_name: useRef<HTMLInputElement>(null),
        email: useRef<HTMLInputElement>(null),
        phone: useRef<HTMLInputElement>(null),
        headline: useRef<HTMLInputElement>(null),
        min_experience: useRef<HTMLInputElement>(null),
        max_experience: useRef<HTMLInputElement>(null),
        education: useRef<HTMLInputElement>(null),
        certifications: useRef<HTMLInputElement>(null),
        projects: useRef<HTMLInputElement>(null),
        salary_min: useRef<HTMLInputElement>(null),
        salary_max: useRef<HTMLInputElement>(null),
        work_style: useRef<HTMLInputElement>(null),
        applied_date_from: useRef<HTMLInputElement>(null),
        applied_date_to: useRef<HTMLInputElement>(null),
        location: useRef<HTMLInputElement>(null),
        skills: useRef<BaseSelectRef>(null),
    };


    useEffect(() => {
        if (focusedField === 'skills') {
            (refs.skills.current as { focus?: () => void })?.focus?.();
        } else if (focusedField !== null) {
            refs[focusedField]?.current?.focus?.();
        }
    }, [focusedField]);
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof CandidateFilter
    ) => {
        setFocusedField(field);
        onChange({
            ...filters,
            [field]:
                field === 'min_experience' || field === 'max_experience'
                    ? e.target.value
                        ? +e.target.value
                        : undefined
                    : field.includes('salary') ? (e.target.value ? +e.target.value : undefined) :

                    e.target.value || undefined,
        });
    };

    const handleSelectChange = (value: string, field: keyof CandidateFilter) => {
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
        return !value.includes(':'); // Skill nodes don't have ":" (e.g., "java")
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

        // Expand skill nodes to include all proficiency levels
        const expandedValues: string[] = [];
        selectedValues.forEach((value) => {
            if (isSkillNode(value)) {
                // If a skill node is selected, add all its proficiency levels
                expandedValues.push(...getProficiencyNodes(value));
            } else {
                // If a proficiency node is selected, add it directly
                expandedValues.push(value);
            }
        });

        // Remove duplicates and limit to MAX_SKILLS
        const uniqueValues = Array.from(new Set(expandedValues));

        // Convert to skills array
        const newSkills = uniqueValues.map((value) => decodeSkill(value));

        console.log("newSkills", newSkills);

        onChange({
            ...filters,
            skills: newSkills.length > 0 ? newSkills : undefined,
        });
    };

    const handleSelect = (values: string[], option: any) => {
        const currentSkills = filters.skills || [];
        let updatedSkills = [...currentSkills];

        // values to tablica wybranych wartości - obsłuż je wszystkie:
        values.forEach(value => {
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
                    ...updatedSkills.filter((s) => s.name !== name || s.proficiencyLevel !== proficiencyLevel),
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
        let updatedSkills = filters.skills || [];

        // Process each deselected value
        values.forEach((value) => {
            if (isSkillNode(value)) {
                // Remove all proficiency levels for the skill
                updatedSkills = updatedSkills.filter((s) => s.name !== value);
            } else {
                const { name, proficiencyLevel } = decodeSkill(value);
                // Remove specific proficiency level
                updatedSkills = updatedSkills.filter(
                    (s) => s.name !== name || s.proficiencyLevel !== proficiencyLevel
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
                Filter Candidates
            </motion.h3>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            >
                <Label htmlFor="first_name" className="block text-base font-semibold text-gray-900 mb-2">
                    First Name
                </Label>
                <Input
                    id="first_name"
                    ref={refs.first_name}
                    value={filters.first_name || ''}
                    onChange={(e) => handleInputChange(e, 'first_name')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter first name"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
            >
                <Label htmlFor="last_name" className="block text-base font-semibold text-gray-900 mb-2">
                    Last Name
                </Label>
                <Input
                    id="last_name"
                    ref={refs.last_name}
                    value={filters.last_name || ''}
                    onChange={(e) => handleInputChange(e, 'last_name')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter last name"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            >
                <Label htmlFor="email" className="block text-base font-semibold text-gray-900 mb-2">
                    Email
                </Label>
                <Input
                    id="email"
                    ref={refs.email}
                    value={filters.email || ''}
                    onChange={(e) => handleInputChange(e, 'email')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter email"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
            >
                <Label htmlFor="phone" className="block text-base font-semibold text-gray-900 mb-2">
                    Phone
                </Label>
                <Input
                    id="phone"
                    ref={refs.phone}
                    value={filters.phone || ''}
                    onChange={(e) => handleInputChange(e, 'phone')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter phone number"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
            >
                <Label htmlFor="headline" className="block text-base font-semibold text-gray-900 mb-2">
                    Headline
                </Label>
                <Input
                    id="headline"
                    ref={refs.headline}
                    value={filters.headline || ''}
                    onChange={(e) => handleInputChange(e, 'headline')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter headline"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 }}
                className="flex gap-4"
            >
                <div className="flex-1">
                    <Label htmlFor="min_experience" className="block text-base font-semibold text-gray-900 mb-2">
                        Min Experience (years)
                    </Label>
                    <Input
                        id="min_experience"
                        type="number"
                        ref={refs.min_experience}
                        value={filters.min_experience ?? ''}
                        onChange={(e) => handleInputChange(e, 'min_experience')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                        placeholder="Min"
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="max_experience" className="block text-base font-semibold text-gray-900 mb-2">
                        Max Experience (years)
                    </Label>
                    <Input
                        id="max_experience"
                        type="number"
                        ref={refs.max_experience}
                        value={filters.max_experience ?? ''}
                        onChange={(e) => handleInputChange(e, 'max_experience')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                        placeholder="Max"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
            >
                <Label htmlFor="education" className="block text-base font-semibold text-gray-900 mb-2">
                    Education
                </Label>
                <Input
                    id="education"
                    ref={refs.education}
                    value={filters.education || ''}
                    onChange={(e) => handleInputChange(e, 'education')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter education"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
            >
                <Label htmlFor="certifications" className="block text-base font-semibold text-gray-900 mb-2">
                    Certifications
                </Label>
                <Input
                    id="certifications"
                    ref={refs.certifications}
                    value={filters.certifications || ''}
                    onChange={(e) => handleInputChange(e, 'certifications')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter certifications"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
            >
                <Label htmlFor="projects" className="block text-base font-semibold text-gray-900 mb-2">
                    Projects
                </Label>
                <Input
                    id="projects"
                    ref={refs.projects}
                    value={filters.projects || ''}
                    onChange={(e) => handleInputChange(e, 'projects')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter projects"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
                className="flex gap-4"
            >
                <div className="flex-1">
                    <Label htmlFor="salary_min" className="block text-base font-semibold text-gray-900 mb-2">
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
                    <Label htmlFor="salary_max" className="block text-base font-semibold text-gray-900 mb-2">
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
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }}
            >
                <Label htmlFor="work_style" className="block text-base font-semibold text-gray-900 mb-2">
                    Work Style
                </Label>
                <Select
                    value={filters.work_style || ''}
                    onValueChange={(value) => handleSelectChange(value, 'work_style')}
                >
                    <SelectTrigger
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
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
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.65 }}
                className="flex gap-4"
            >
                <div className="flex-1">
                    <Label htmlFor="applied_date_from" className="block text-base font-semibold text-gray-900 mb-2">
                        Applied From
                    </Label>
                    <Input
                        id="applied_date_from"
                        type="date"
                        value={filters.applied_date_from || ''}
                        onChange={(e) => handleInputChange(e, 'applied_date_from')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="applied_date_to" className="block text-base font-semibold text-gray-900 mb-2">
                        Applied To
                    </Label>
                    <Input
                        id="applied_date_to"
                        type="date"
                        value={filters.applied_date_to || ''}
                        onChange={(e) => handleInputChange(e, 'applied_date_to')}
                        className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.7 }}
            >
                <Label htmlFor="location" className="block text-base font-semibold text-gray-900 mb-2">
                    Location
                </Label>
                <Input
                    id="location"
                    value={filters.location || ''}
                    onChange={(e) => handleInputChange(e, 'location')}
                    className="w-full px-5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 hover:bg-gray-100 hover:border-indigo-300"
                    placeholder="Enter location"
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
                            .map((s) => encodeSkill(s.name!, s.proficiencyLevel!)) || []
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