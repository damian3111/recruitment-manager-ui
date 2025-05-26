import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Compass, Star, Target } from "lucide-react";

const recommendations = [
    {
        icon: <Target className="h-8 w-8 text-indigo-600" />,
        title: "AI Career Compass",
        description:
            "Get smart job suggestions based on your strengths and preferences.",
    },
    {
        icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
        title: "Skill Booster",
        description:
            "We analyze market trends and suggest skills you should develop next.",
    },
    {
        icon: <Compass className="h-8 w-8 text-green-600" />,
        title: "Your Market Position",
        description:
            "Understand how your profile ranks against others in similar roles.",
    },
    {
        icon: <Star className="h-8 w-8 text-pink-500" />,
        title: "Dream Job Tracker",
        description:
            "Track companies and roles you’d love to work at, and get notified when openings match."
    }
];

export default function CareerCompassPage() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold mb-4 text-gray-800"
                >
                    🌟 Career Compass
                </motion.h1>

                <p className="text-lg text-gray-600 mb-8">
                    Navigate your career journey with AI insights tailored just for you.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            className={`cursor-pointer ${
                                activeIndex === index ? "bg-white shadow-xl" : "bg-white/80 shadow"
                            } rounded-xl transition-all duration-300`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <Card>
                                <CardContent className="p-6 flex items-start gap-4">
                                    {rec.icon}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-12"
                >
                    <Button size="lg" className="text-white bg-indigo-600 hover:bg-indigo-700">
                        Get Personalized Insights
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
