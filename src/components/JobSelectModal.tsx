import React, { useState } from 'react';
import { JobType } from '@/lib/jobService';

interface JobSelectModalProps {
    open: boolean;
    jobs: JobType[];
    onCancel: () => void;
    onSubmit: (selectedJobIds: JobType[]) => void;
}

const JobSelectModal: React.FC<JobSelectModalProps> = ({
                                                           open,
                                                           jobs,
                                                           onCancel,
                                                           onSubmit,
                                                       }) => {
    const [selectedJobs, setSelectedJobs] = useState<JobType[]>([]);

    const toggleJobSelection = (job: JobType) => {
        setSelectedJobs((prev) =>
            prev.some((j) => j.id === job.id)
                    ? prev.filter((j) => j.id !== job.id)
                    : [...prev, job]
        );
    };

    const handleSubmit = () => {
        onSubmit(selectedJobs);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Select job listings for the candidate
                </h2>
                <div className="space-y-3">
                    {jobs.map((job) => (
                        <label key={job.id} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectedJobs.some((j) => j.id === job.id)}
                                onChange={() => toggleJobSelection(job)}
                                className="h-4 w-4"
                            />
                            <span className="text-gray-700">{job.title}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Send Proposal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobSelectModal;
