'use client';


import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const dummyJobs = [
    {
        title: 'Frontend Developer',
        match: 82,
        requiredSkills: ['React', 'TypeScript', 'CSS', 'REST APIs', 'Tailwind'],
        missingSkills: ['Jest', 'Storybook', 'Cypress']
    },
    {
        title: 'Backend Engineer',
        match: 67,
        requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        missingSkills: ['Kafka', 'Redis']
    },
    {
        title: 'DevOps Specialist',
        match: 74,
        requiredSkills: ['AWS', 'Terraform', 'CI/CD', 'Kubernetes'],
        missingSkills: ['Grafana', 'Prometheus']
    },
    {
        title: 'Fullstack Engineer',
        match: 88,
        requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'GraphQL'],
        missingSkills: ['Next.js', 'Prisma']
    },
    {
        title: 'Data Analyst',
        match: 71,
        requiredSkills: ['Python', 'Pandas', 'SQL', 'Tableau'],
        missingSkills: ['Airflow', 'Power BI']
    },
    {
        title: 'Mobile Developer',
        match: 63,
        requiredSkills: ['React Native', 'TypeScript', 'Redux'],
        missingSkills: ['Flutter', 'Firebase']
    }
];
export default function RecruiterProfile() {

    return (
        <div className="p-10 space-y-12 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-gray-800">🎯 Skill Matcher</h1>
                <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                    Discover how well your skills align with today’s most in-demand jobs — and what to improve.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {dummyJobs.map((job, idx) => (
                    <motion.div
                        key={job.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 }}
                    >
                        <Card className="p-6 rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all">
                            <CardContent className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{job.title}</h2>
                                    <p className="text-sm text-gray-500">Professional Match Overview</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Match Score</p>
                                    <Progress value={job.match} />
                                    <p className="text-sm text-gray-600 mt-1">{job.match}% match</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2 font-medium">✅ Required Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills.map(skill => (
                                            <Badge key={skill} variant="default" className="bg-blue-100 text-blue-800">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2 font-medium">📚 Suggested Skills to Learn</p>
                                    <div className="flex flex-wrap gap-2">
                                        {job.missingSkills.map(skill => (
                                            <Badge key={skill} variant="outline" className="border-dashed text-red-500 border-red-400">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
