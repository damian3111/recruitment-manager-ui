'use client';

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
import {JobFilter} from '@/lib/jobService';

type Props = {
    filters: JobFilter;
    onChange: (filters: JobFilter) => void;
    focusedField: keyof JobFilter;
    setFocusedField: (field: keyof JobFilter) => void;
};

export default function JobFilters({
                                       filters,
                                       onChange,
                                       focusedField,
                                       setFocusedField,
                                   }: Props) {
    const refs = {
        title: useRef<HTMLInputElement>(null),
        location: useRef<HTMLInputElement>(null),
        salary_min: useRef<HTMLInputElement>(null),
        salary_max: useRef<HTMLInputElement>(null),
        company_name: useRef<HTMLInputElement>(null),
        posted_date: useRef<HTMLInputElement>(null),
        application_deadline: useRef<HTMLInputElement>(null),
        currency: useRef<HTMLInputElement>(null),
        employment_type: useRef<HTMLInputElement>(null),
        industry: useRef<HTMLInputElement>(null),
        experience_level: useRef<HTMLInputElement>(null),
    };

    useEffect(() => {
        refs[focusedField]?.current?.focus();
    }, [focusedField]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof JobFilter
    ) => {
        setFocusedField(field);
        const value = e.target.value;
        onChange({
            ...filters,
            [field]: field.includes('salary') ? (value ? +value : undefined) : value || undefined,
        });
    };

    const handleSelectChange = (
        value: string,
        field: keyof JobFilter
    ) => {
        setFocusedField(field);
        onChange({
            ...filters,
            [field]: value || undefined,
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    ref={refs.title}
                    value={filters.title || ''}
                    onChange={(e) => handleInputChange(e, 'title')}
                />
            </div>

            <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                    id="company_name"
                    ref={refs.company_name}
                    value={filters.company_name || ''}
                    onChange={(e) => handleInputChange(e, 'company_name')}
                />
            </div>

            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    ref={refs.location}
                    value={filters.location || ''}
                    onChange={(e) => handleInputChange(e, 'location')}
                />
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="salary_min">Min Salary</Label>
                    <Input
                        id="salary_min"
                        type="number"
                        ref={refs.salary_min}
                        value={filters.salary_min ?? ''}
                        onChange={(e) => handleInputChange(e, 'salary_min')}
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="salary_max">Max Salary</Label>
                    <Input
                        id="salary_max"
                        type="number"
                        ref={refs.salary_max}
                        value={filters.salary_max ?? ''}
                        onChange={(e) => handleInputChange(e, 'salary_max')}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                    id="currency"
                    ref={refs.currency}
                    value={filters.currency || ''}
                    onChange={(e) => handleInputChange(e, 'currency')}
                />
            </div>

            <div>
                <Label htmlFor="employment_type">Employment Type</Label>
                <Input
                    id="employment_type"
                    ref={refs.employment_type}
                    value={filters.employment_type || ''}
                    onChange={(e) => handleInputChange(e, 'employment_type')}
                />
            </div>

            <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                    id="industry"
                    ref={refs.industry}
                    value={filters.industry || ''}
                    onChange={(e) => handleInputChange(e, 'industry')}
                />
            </div>

            <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Input
                    id="experience_level"
                    ref={refs.experience_level}
                    value={filters.experience_level || ''}
                    onChange={(e) => handleInputChange(e, 'experience_level')}
                />
            </div>

            <div>
                <Label htmlFor="employment_mode">Employment Mode</Label>
                <Select
                    value={filters.employment_mode || ''}
                    onValueChange={(val) => handleSelectChange(val, 'employment_mode')}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select employment mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="posted_date">Posted Date</Label>
                <Input
                    id="posted_date"
                    type="date"
                    ref={refs.posted_date}
                    value={filters.posted_date || ''}
                    onChange={(e) => handleInputChange(e, 'posted_date')}
                />
            </div>

            <div>
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                    id="application_deadline"
                    type="date"
                    ref={refs.application_deadline}
                    value={filters.application_deadline || ''}
                    onChange={(e) => handleInputChange(e, 'application_deadline')}
                />
            </div>
        </div>
    );
}
