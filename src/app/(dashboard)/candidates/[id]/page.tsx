'use client';

import { useCandidate } from '@/lib/candidatesService';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/icons';
import { Card, CardContent } from '@/components/ui/card';

export default function CandidateDetailPage() {
    const params = useParams();
    const id = Number(params?.id);
    const { data: candidate, isLoading, isError, error } = useCandidate(id);

    if (isLoading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner />
            </div>
        );
    }

    if (isError || !candidate) {
        return (
            <p className="text-red-500 text-center mt-10">
                ❌ Error loading candidate: {(error as Error)?.message || 'Not found'}
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {candidate.profile_picture_url && (
                            <img
                                src={candidate.profile_picture_url}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border border-gray-300"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {candidate.first_name} {candidate.last_name}
                            </h2>
                            <p className="text-sm text-gray-500">{candidate.headline}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <Info label="Email" value={candidate.email} />
                        <Info label="Phone" value={candidate.phone} />
                        <Info label="Location" value={candidate.location} />
                        <Info label="Work Style" value={candidate.work_style} />
                        <Info label="Years of Experience" value={`${candidate.years_of_experience}`} />
                        <Info label="Expected Salary" value={candidate.salary_expectation} />
                        <Info label="Applied Date" value={new Date(candidate.applied_date ?? '').toLocaleString()} />
                    </div>

                    {candidate.summary && (
                        <Section label="Summary">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.summary}</p>
                        </Section>
                    )}
                    {candidate.experience && (
                        <Section label="Experience">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.experience}</p>
                        </Section>
                    )}
                    {candidate.education && (
                        <Section label="Education">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.education}</p>
                        </Section>
                    )}
                    {candidate.certifications && (
                        <Section label="Certifications">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.certifications}</p>
                        </Section>
                    )}
                    {candidate.projects && (
                        <Section label="Projects">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{candidate.projects}</p>
                        </Section>
                    )}
                    {candidate.skills && (
                        <Section label="Skills">
                            <div className="flex flex-wrap gap-2">
                                {candidate.skills.map((skill) => (
                                    <span
                                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                                    >
                    {skill.name}
                  </span>
                                ))}
                            </div>
                        </Section>
                    )}
                    {candidate.media_url && (
                        <Section label="Portfolio / Media">
                            <a
                                href={candidate.media_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View Media
                            </a>
                        </Section>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Helper components
function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-gray-500 font-medium">{label}</p>
            <p className="text-gray-800">{value || '-'}</p>
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-md font-semibold text-gray-700 mb-1">{label}</h3>
            {children}
        </div>
    );
}
