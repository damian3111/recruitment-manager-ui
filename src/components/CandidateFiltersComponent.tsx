'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/hooks';

export type CandidateFilters = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    headline?: string;
    summary?: string;
    experience?: string;
    years_of_experience?: number;
    education?: string;
    certifications?: string;
    work_experiences?: string;
    projects?: string;
    salary_expectation?: string;
    work_style?: string;
    location?: string;
    skills?: string;
};

export default function CandidateFiltersComponent({
                                                      onChange,
                                                  }: {
    onChange: (filters: CandidateFilters) => void;
}) {
    const [filters, setFilters] = useState<CandidateFilters>({});
    // const debouncedFilters = useDebounce(filters, 500);

    useEffect(() => {
        onChange(filters);
    }, [filters, onChange]);

    const handleChange = (key: keyof CandidateFilters, value: string | number) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <Input placeholder="First Name" onChange={(e) => handleChange('first_name', e.target.value)} />
            <Input placeholder="Last Name" onChange={(e) => handleChange('last_name', e.target.value)} />
            <Input placeholder="Email" onChange={(e) => handleChange('email', e.target.value)} />
            <Input placeholder="Phone" onChange={(e) => handleChange('phone', e.target.value)} />
            <Input placeholder="Headline" onChange={(e) => handleChange('headline', e.target.value)} />
            <Input placeholder="Summary" onChange={(e) => handleChange('summary', e.target.value)} />
            <Input placeholder="Experience" onChange={(e) => handleChange('experience', e.target.value)} />
            <Input placeholder="Years of Experience" type="number" onChange={(e) => handleChange('years_of_experience', parseInt(e.target.value))} />
            <Input placeholder="Education" onChange={(e) => handleChange('education', e.target.value)} />
            <Input placeholder="Certifications" onChange={(e) => handleChange('certifications', e.target.value)} />
            <Input placeholder="Work Experiences" onChange={(e) => handleChange('work_experiences', e.target.value)} />
            <Input placeholder="Projects" onChange={(e) => handleChange('projects', e.target.value)} />
            <Input placeholder="Salary Expectation" onChange={(e) => handleChange('salary_expectation', e.target.value)} />
            <Input placeholder="Work Style" onChange={(e) => handleChange('work_style', e.target.value)} />
            <Input placeholder="Location" onChange={(e) => handleChange('location', e.target.value)} />
            <Input placeholder="Skills (comma-separated)" onChange={(e) => handleChange('skills', e.target.value)} />
        </div>
    );
}
