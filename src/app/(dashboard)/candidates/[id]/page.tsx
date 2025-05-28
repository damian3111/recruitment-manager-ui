'use client';

import { useCandidate } from '@/lib/candidatesService';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useState } from 'react';

// Sample skills for demonstration
const SAMPLE_SKILLS = [
    { name: 'JavaScript', proficiencyLevel: 'Expert' },
    { name: 'Python', proficiencyLevel: 'Good' },
    { name: 'SQL', proficiencyLevel: 'Familiar' },
];

// Helper to get proficiency-based tag colors (aligned with JobDetailPage)
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
function Info({ label, value }: { label: string; value?: string }) {
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

export default function CandidateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);
    const { data: candidate, isLoading, isError, error } = useCandidate(id);
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mt-10"
            >
                <Spinner className="w-8 h-8 text-teal-600" />
            </motion.div>
        );
    }

    if (isError || !candidate) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-red-500 text-center mt-10"
            >
                ❌ Error loading candidate: {(error as Error)?.message || 'Not found'}
            </motion.div>
        );
    }

    // Use SAMPLE_SKILLS as specified
    const skills = SAMPLE_SKILLS;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-[64rem] min-w-[64rem] mx-auto px-4 py-6"
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

                <CardContent className="p-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex pt-5 items-center gap-4">
                        {candidate.profile_picture_url && (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.5 }}
                                transition={{ duration: 0.3 }}
                                src={"/person1-photo.jpg"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border border-gray-200"
                            />
                        )}
                        <div className={" ml-12"}>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="text-xl font-bold text-gray-900 tracking-tight"
                            >
                                {candidate.first_name} {candidate.last_name}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="text-base text-gray-600"
                            >
                                {candidate.headline || 'N/A'}
                            </motion.p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="grid grid-cols-1 pt-10 sm:grid-cols-2 gap-x-8 gap-y-4 text-base"
                    >
                        <Info label="Email" value={candidate.email} />
                        <Info label="Phone" value={candidate.phone} />
                        <Info label="Location" value={candidate.location} />
                        <Info label="Work Style" value={candidate.work_style} />
                        <Info label="Years of Experience" value={`${candidate.years_of_experience}`} />
                        <Info label="Expected Salary" value={candidate.salary_expectation} />
                        <Info
                            label="Applied Date"
                            value={
                                candidate.applied_date
                                    ? new Date(candidate.applied_date).toLocaleString()
                                    : 'N/A'
                            }
                        />
                    </motion.div>

                    {/* Additional Sections */}
                    {candidate.summary && (
                        <Section label="Summary">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="text-base text-gray-600 whitespace-pre-line"
                            >
                                {candidate.summary}
                            </motion.p>
                        </Section>
                    )}
                    {candidate.experience && (
                        <Section label="Experience">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                                className="text-base text-gray-600 whitespace-pre-line"
                            >
                                {candidate.experience}
                            </motion.p>
                        </Section>
                    )}
                    {candidate.education && (
                        <Section label="Education">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                                className="text-base text-gray-600 whitespace-pre-line"
                            >
                                {candidate.education}
                            </motion.p>
                        </Section>
                    )}
                    {candidate.certifications && (
                        <Section label="Certifications">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.7 }}
                                className="text-base text-gray-600 whitespace-pre-line"
                            >
                                {candidate.certifications}
                            </motion.p>
                        </Section>
                    )}
                    {candidate.projects && (
                        <Section label="Projects">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                                className="text-base text-gray-600 whitespace-pre-line"
                            >
                                {candidate.projects}
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
                    {candidate.media_url && (
                        <Section label="Portfolio / Media">
                            <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 1.0 }}
                                href={candidate.media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-700 hover:underline text-base transition-colors duration-200"
                            >
                                View Media
                            </motion.a>
                        </Section>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}