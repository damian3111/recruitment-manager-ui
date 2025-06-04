'use client';

import { useParams, useRouter } from 'next/navigation';
import { useJob } from '@/lib/jobService';
import { notFound } from 'next/navigation';
import { Spinner } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useState } from 'react';

// Sample skills for demonstration
const SAMPLE_SKILLS = [
    { name: 'JavaScript', proficiencyLevel: 'Expert' },
    { name: 'Python', proficiencyLevel: 'Good' },
    { name: 'SQL', proficiencyLevel: 'Familiar' },
];

// Helper to parse skills from requirements string (unused since SAMPLE_SKILLS is specified)
const parseSkillsFromRequirements = (requirements: string | undefined): { name: string; proficiencyLevel: string }[] => {
    if (!requirements) return SAMPLE_SKILLS;
    return requirements
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill)
        .map((skill) => ({ name: skill, proficiencyLevel: 'N/A' }));
};

// Helper to get proficiency-based tag colors
const getProficiencyColor = (level: string) => {
    switch (level) {
        case 'Expert':
            return 'bg-green-50 text-green-800 border-green-200';
        case 'Good':
            return 'bg-blue-50 text-blue-800 border-blue-200';
        case 'Familiar':
            return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

// Helper Components
function Info({ label, value }: { label: string; value?: string | number }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <span className="text-base text-gray-800">{value || 'N/A'}</span>
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="relative">
            <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg mb-3">
                {label}
            </h3>
            <div className="pl-4">{children}</div>
        </div>
    );
}

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);
    const { data: job, isLoading, isError } = useJob(id);
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-16"
            >
                <Spinner className="w-8 h-8 text-teal-600" />
            </motion.div>
        );
    }

    if (isError || !job) {
        return notFound();
    }

    const skills = !job?.skills || job?.skills.length === 0 ? SAMPLE_SKILLS : job?.skills;

    return (
        <div >
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-[64rem] mx-auto px-4 py-6"
        >
            <Card className="relative w-full p-20 rounded-2xl shadow-xl border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300">
                {/* Back Button */}
                <div className="absolute top-6 left-6">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        aria-label="Go back to previous page"
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 shadow-sm"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-700" />
                    </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-7 right-10 flex items-center gap-3">
                    {/*<Button*/}
                    {/*    className="bg-teal-600 text-white hover:bg-teal-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"*/}
                    {/*>*/}
                    {/*    Apply Now*/}
                    {/*</Button>*/}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                    >
                        <Bookmark
                            className="h-6 w-7 transition-colors duration-300"
                            stroke={isBookmarked ? '#FFD700' : '#1F2937'}
                            fill={isBookmarked ? '#FFD700' : 'none'}
                        />
                    </motion.button>
                </div>

                <CardContent className="p-0 pt-8 space-y-8">
                    {/* Header Section */}
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-3xl font-bold text-gray-900 tracking-tight"
                        >
                            {job.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="text-lg text-gray-600"
                        >
                            {job.company} · {job.location}
                        </motion.p>
                    </div>

                    {/* Info Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-52 gap-y-6 text-base border-t border-gray-200 pt-6"
                    >
                        <Info label="Employment Type" value={job.employment_type} />
                        <Info label="Experience Level" value={job.experience_level} />
                        <Info label="Employment Mode" value={job.employment_mode} />
                        <Info label="Industry" value={job.industry} />
                        <Info label="Salary" value={`${job.salary_min} - ${job.salary_max} ${job.currency}`} />
                        <Info
                            label="Posted"
                            value={job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}
                        />
                        <Info
                            label="Deadline"
                            value={
                                job.application_deadline
                                    ? new Date(job.application_deadline).toLocaleDateString()
                                    : 'N/A'
                            }
                        />
                    </motion.div>

                    {/* Additional Sections */}
                    {job.description && (
                        <Section label="Job Description">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="text-base text-gray-700 leading-relaxed"
                            >
                                {job.description}
                            </motion.p>
                        </Section>
                    )}
                    {job.requirements && (
                        <Section label="Requirements">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="text-base text-gray-700 leading-relaxed"
                            >
                                {job.requirements}
                            </motion.p>
                        </Section>
                    )}
                    {job.responsibilities && (
                        <Section label="Responsibilities">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                className="text-base text-gray-700 leading-relaxed"
                            >
                                {job.responsibilities}
                            </motion.p>
                        </Section>
                    )}
                    {job.benefits && (
                        <Section label="Benefits">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.7 }}
                                className="text-base text-gray-700 leading-relaxed"
                            >
                                {job.benefits}
                            </motion.p>
                        </Section>
                    )}
                    {/* Skills Section */}
                    <Section label="Skills">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 }}
                            className="flex flex-wrap gap-2"
                        >
                            {skills.map((skill, index) => (
                                <motion.span
                                    key={`${skill.name}-${skill.proficiencyLevel}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: 0.9 + index * 0.05 }}
                                    className={`px-3 py-1 ${getProficiencyColor(skill.proficiencyLevel)} rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300`}
                                >
                                    {skill.name}: {skill.proficiencyLevel}
                                </motion.span>
                            ))}
                        </motion.div>
                    </Section>
                </CardContent>
            </Card>
        </motion.div>
        </div>
    );
}