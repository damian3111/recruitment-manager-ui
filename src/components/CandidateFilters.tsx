'use client';

import { CandidateFilter } from '@/lib/candidatesService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type Props = {
    filters: CandidateFilter;
    onChange: (filters: CandidateFilter) => void;
    focusedField: string;
    setFocusedField: (field: string) => void;
};
export default function CandidateFilters({
                                             filters,
                                             onChange,
                                             focusedField,
                                             setFocusedField,
                                         }: Props) {
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const headlineInputRef = useRef<HTMLInputElement>(null);
    const minExperienceInputRef = useRef<HTMLInputElement>(null);
    const maxExperienceInputRef = useRef<HTMLInputElement>(null);
    const educationInputRef = useRef<HTMLInputElement>(null);
    const certificationInputRef = useRef<HTMLInputElement>(null);
    const projectsInputRef = useRef<HTMLInputElement>(null);
    const salaryExpectationInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focusedField === "first_name") {
            firstNameInputRef.current?.focus();
        } else if(focusedField === "last_name") {
            lastNameInputRef.current?.focus();
        } else if (focusedField === "email"){
            emailInputRef.current?.focus();
        }else if (focusedField === "phone"){
            phoneInputRef.current?.focus();
        }else if (focusedField === "headline"){
            headlineInputRef.current?.focus();
        }else if (focusedField === "min_experience"){
            minExperienceInputRef.current?.focus();
        }else if (focusedField === "max_experience"){
            maxExperienceInputRef.current?.focus();
        }else if (focusedField === "education"){
            educationInputRef.current?.focus();
        }else if (focusedField === "certification"){
            certificationInputRef.current?.focus();
        }else if (focusedField === "projects"){
            projectsInputRef.current?.focus();
        }else if (focusedField === "salary_expectation"){
            salaryExpectationInputRef.current?.focus();
        }
    }, [focusedField]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setFocusedField(field); // persist in parent
        onChange({
            ...filters,
            [field]: e.target.value || undefined,
        });
    };

    const handleSelectChange = (
        value: string,
        field: string
    ) => {
        setFocusedField(field);
        onChange({
            ...filters,
            [field]: value || undefined,
        });
    };

    return (
        <div className="space-y-4">
            {/* Basic Text Inputs */}
            <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                    id="first_name"
                    ref={firstNameInputRef}
                    value={filters.first_name || ''}
                    onChange={(e) => {
                        setFocusedField("first_name");
                        handleInputChange(e, "first_name");
                    }}
                />
            </div>

            <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                    id="last_name"
                    ref={lastNameInputRef}
                    value={filters.last_name || ''}
                    onChange={(e) => {
                        setFocusedField("last_name");
                        handleInputChange(e, "last_name");
                    }}
                />
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    ref={emailInputRef}
                    value={filters.email || ''}
                    onChange={(e) => {
                        setFocusedField("email");
                        handleInputChange(e, "email")}}
                />
            </div>

            <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                    id="phone"
                    ref={phoneInputRef}
                    value={filters.phone || ''}
                    onChange={(e) => {
                        setFocusedField("phone");
                        handleInputChange(e, "phone");
                    }}
                />
            </div>

            <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                    id="headline"
                    ref={headlineInputRef}
                    value={filters.headline || ''}
                    onChange={(e) => {
                        setFocusedField("headline");
                        handleInputChange(e, "headline");
                    }}
                />
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="min_experience">Min Experience (years)</Label>
                    <Input
                        id="min_experience"
                        type="number"
                        ref={minExperienceInputRef}
                        value={filters.min_experience ?? ''}
                        onChange={(e) =>{
                            setFocusedField("min_experience");
                            onChange({ ...filters, min_experience: e.target.value ? +e.target.value : undefined })
                        }
                    }
                    />
                </div>

                <div className="flex-1">
                    <Label htmlFor="max_experience">Max Experience (years)</Label>
                    <Input
                        id="max_experience"
                        type="number"
                        ref={maxExperienceInputRef}
                        value={filters.max_experience ?? ''}
                        onChange={(e) =>{
                            setFocusedField("max_experience");
                            onChange({ ...filters, max_experience: e.target.value ? +e.target.value : undefined })
                            }
                        }
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="education">Education</Label>
                <Input
                    id="education"
                    ref={educationInputRef}
                    value={filters.education || ''}
                    onChange={(e) => {
                        setFocusedField("education");
                        handleInputChange(e, "education")}
                    }
                />
            </div>

            <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                    id="certifications"
                    ref={certificationInputRef}
                    value={filters.certifications || ''}
                    onChange={(e) => {
                        setFocusedField("certifications");
                        handleInputChange(e, "certifications")}
                    }
                />
            </div>

            <div>
                <Label htmlFor="projects">Projects</Label>
                <Input
                    ref={projectsInputRef}
                    id="projects"
                    value={filters.projects || ''}
                    onChange={(e) => {
                        setFocusedField("projects");
                        handleInputChange(e, "projects")}
                    }
                />
            </div>

            <div>
                <Label htmlFor="salary_expectation">Salary Expectation</Label>
                <Input
                    id="salary_expectation"
                    ref={salaryExpectationInputRef}
                    value={filters.salary_expectation || ''}
                    onChange={(e) =>{
                        setFocusedField("salary_expectation");
                        handleInputChange(e, "salary_expectation")}
                    }
                />
            </div>

            <div>
                <Label htmlFor="work_style">Work Style</Label>
                <Select
                    value={filters.work_style || ''}
                    onValueChange={(value) => {
                        handleSelectChange(value, 'work_style')}
                }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select work style" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="applied_date_from">Applied From</Label>
                    <Input
                        id="applied_date_from"
                        type="date"
                        value={filters.applied_date_from || ''}
                        onChange={(e) => handleInputChange(e, "applied_date_from")}
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="applied_date_to">Applied To</Label>
                    <Input
                        id="applied_date_to"
                        type="date"
                        value={filters.applied_date_to || ''}
                        onChange={(e) => handleInputChange(e, "applied_date_to")}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={filters.location || ''}
                    onChange={(e) => handleInputChange(e, "location")}
                />
            </div>

            <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                    id="skills"
                    value={filters.skills || ''}
                    onChange={(e) => handleInputChange(e, "skills")}
                />
            </div>
        </div>
    );
}