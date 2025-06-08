'use client';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { Flame, CheckCircle, Target } from "lucide-react";

const milestones = [
    { title: "Build your CV", description: "Create and upload a modern CV", completed: true },
    { title: "Apply to 5 jobs", description: "Send applications to at least 5 jobs", completed: true },
    { title: "Get interviewed", description: "Attend at least 1 interview", completed: false },
    { title: "Get certified", description: "Complete a recommended course", completed: false },
];

const learningTracks = [
    { title: "React Advanced", level: "Mid-Level", provider: "Frontend Masters" },
    { title: "Effective Communication", level: "All Levels", provider: "LinkedIn Learning" },
    { title: "System Design Basics", level: "Senior-Level", provider: "Udemy" },
];

const quotes = [
    "Opportunities don't happen. You create them. — Chris Grosser",
    "Success is where preparation and opportunity meet. — Bobby Unser",
    "If you want something you've never had, you must be willing to do something you've never done. — Thomas Jefferson",
];
export default function CareerGrowthPage() {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const progressPercent = Math.round(
        (milestones.filter((m) => m.completed).length / milestones.length) * 100
    );

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📈 Career Growth Tracker</h1>

            <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Milestones</h2>
                    <Badge variant="secondary">{progressPercent}% Complete</Badge>
                </div>
                <Progress value={progressPercent} className="mb-4 h-3" />
                <div className="space-y-4">
                    {milestones.map((milestone, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border"
                        >
                            <div>
                                <p className="font-medium text-gray-800">{milestone.title}</p>
                                <p className="text-sm text-gray-500">{milestone.description}</p>
                            </div>
                            {milestone.completed ? (
                                <CheckCircle className="text-green-500" />
                            ) : (
                                <Target className="text-gray-400" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">🎓 Suggested Learning Tracks</h2>
                    <Flame className="text-orange-500" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {learningTracks.map((track, i) => (
                        <TooltipProvider key={i}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="bg-gradient-to-tr from-blue-100 via-white to-white p-4 rounded-xl border hover:shadow-md transition-all">
                                        <h3 className="font-medium text-gray-800">{track.title}</h3>
                                        <p className="text-sm text-gray-500">{track.level}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Provided by: {track.provider}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>

            <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center text-lg italic text-gray-600 mt-10"
            >
                “{quotes[quoteIndex]}”
            </motion.div>
        </div>
    );
}