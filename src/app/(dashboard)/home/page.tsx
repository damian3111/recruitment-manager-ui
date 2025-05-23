'use client';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, MessageSquare, BarChart3, Compass, Sparkles, ArrowRightCircle, Flame } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useRef } from 'react';
import { useCurrentUser } from '@/lib/userService';

const features = [
    { title: 'Jobs', icon: Briefcase, href: '/jobs', description: 'Create and manage job postings effortlessly.' },
    { title: 'Candidates', icon: Users, href: '/candidates', description: 'Evaluate and track candidate profiles.' },
    { title: 'Analytics', icon: BarChart3, href: '/analytics', description: 'Unlock powerful hiring insights.' },
    { title: 'Chats', icon: MessageSquare, href: '/chats', description: 'Engage with candidates in real-time.' },
    { title: 'Invitations', icon: ArrowRightCircle, href: '/invitations', description: 'Streamline interview scheduling.' },
    { title: 'Career Compass', icon: Compass, href: '/career-compass', description: 'Guide talent to their ideal roles.' },
    { title: 'Skill Matcher', icon: Sparkles, href: '/skill-matcher', description: 'Match skills to job requirements.' },
    { title: 'Growth Tracker', icon: Flame, href: '/growth-tracker', description: 'Monitor team and candidate progress.' },
];

export default function HomePage() {
    // References for scroll-triggered animations
    const featureRef = useRef(null);
    const progressRef = useRef(null);
    const activityRef = useRef(null);
    const notesRef = useRef(null);
    const metricsRef = useRef(null);

    const { data: user, isLoading } = useCurrentUser();
    const featureInView = useInView(featureRef, { once: false, margin: '-100px' });
    const progressInView = useInView(progressRef, { once: false, margin: '-100px' });
    const activityInView = useInView(activityRef, { once: false, margin: '-100px' });
    const notesInView = useInView(notesRef, { once: false, margin: '-100px' });
    const metricsInView = useInView(metricsRef, { once: false, margin: '-100px' });

    // Optional: Log user for debugging
    console.log('User:', user);

    return (
        <main className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-10 space-y-16 overflow-auto">
            {/* Sticky Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-10 bg-white py-8 px-10 shadow-xl rounded-b-2xl border-b-2 border-teal-500"
            >
                <h1 className="text-5xl font-extrabold text-teal-900">
                    Hello, {isLoading ? 'Loading...' : user ? `${user.firstName} ${user.lastName}` : 'Guest'}!
                </h1>
                <p className="text-lg text-gray-600 mt-3">
                    {user?.userRole ? `${user.userRole}: ${user.email}` : 'Empower your hiring process with cutting-edge tools and insights.'}
                </p>
            </motion.header>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative bg-gradient-to-r from-teal-600 to-teal-800 text-white p-16 rounded-2xl shadow-2xl text-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-transparent opacity-50"></div>
                <h2 className="relative text-4xl font-bold mb-6">Transform Your Hiring Experience</h2>
                <p className="relative text-xl max-w-3xl mx-auto mb-8">
                    Discover top talent, streamline workflows, and make data-driven decisions with our advanced platform.
                </p>
                <Link
                    href="/home"
                    className="relative inline-block bg-gold-500 text-teal-900 px-8 py-4 rounded-lg font-semibold hover:bg-gold-400 transition-all shadow-md hover:shadow-lg"
                >
                    Start Now
                </Link>
            </motion.section>

            {/* Feature Navigation Grid */}
            <motion.section
                ref={featureRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: featureInView ? 1 : 0, scale: featureInView ? 1 : 0.95 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {features.map(({ title, icon: Icon, href, description }) => (
                    <motion.div
                        key={title}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                        transition={{ duration: 0.3 }}
                        className="group block p-8 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all border border-teal-100 hover:border-teal-500"
                    >
                        <Link href={href}>
                            <div className="flex items-center gap-5">
                                <Icon className="text-teal-600 group-hover:scale-110 group-hover:text-teal-700 transition" size={40} />
                                <div>
                                    <h2 className="text-2xl font-semibold text-teal-900">{title}</h2>
                                    <p className="text-sm text-gray-600 mt-2">{description}</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.section>

            {/* Progress & Daily Tip Section */}
            <motion.section
                ref={progressRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: progressInView ? 1 : 0, scale: progressInView ? 1 : 0.95 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
                <div className="p-10 bg-white rounded-2xl shadow-lg border border-teal-100">
                    <h3 className="font-semibold text-2xl text-teal-900 mb-6">Weekly Goals</h3>
                    <p className="text-gray-600 mb-8">Monitor your progress toward critical hiring milestones.</p>
                    <div className="space-y-6">
                        <div>
                            <p className="text-base font-medium text-teal-800">Interview Candidates</p>
                            <Progress value={70} className="h-3 bg-teal-100" />
                            <p className="text-sm text-gray-500 mt-2">70% completed (14/20 candidates)</p>
                        </div>
                        <div>
                            <p className="text-base font-medium text-teal-800">Review Applications</p>
                            <Progress value={45} className="h-3 bg-teal-100" />
                            <p className="text-sm text-gray-500 mt-2">45% completed (90/200 applications)</p>
                        </div>
                        <div>
                            <p className="text-base font-medium text-teal-800">Send Invitations</p>
                            <Progress value={90} className="h-3 bg-teal-100" />
                            <p className="text-sm text-gray-500 mt-2">90% completed (18/20 invitations)</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-gradient-to-br from-teal-50 to-white rounded-2xl shadow-lg border border-teal-100">
                    <h3 className="font-semibold text-2xl text-teal-900 mb-6">Daily Tip</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                        Leverage structured interviews to assess soft skills like communication and problem-solving. Pair this with data-driven analytics to identify top talent efficiently.
                    </p>
                </div>
            </motion.section>

            {/* Key Metrics Section */}
            <motion.section
                ref={metricsRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: metricsInView ? 1 : 0, scale: metricsInView ? 1 : 0.95 }}
                transition={{ duration: 0.6 }}
                className="p-10 bg-white rounded-2xl shadow-lg border border-teal-100"
            >
                <h3 className="font-semibold text-2xl text-teal-900 mb-6">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-teal-50 rounded-lg text-center">
                        <h4 className="text-lg font-medium text-teal-800">Active Job Postings</h4>
                        <p className="text-3xl font-bold text-teal-900 mt-2">12</p>
                    </div>
                    <div className="p-6 bg-teal-50 rounded-lg text-center">
                        <h4 className="text-lg font-medium text-teal-800">Applications Received</h4>
                        <p className="text-3xl font-bold text-teal-900 mt-2">245</p>
                    </div>
                    <div className="p-6 bg-teal-50 rounded-lg text-center">
                        <h4 className="text-lg font-medium text-teal-800">Interviews Scheduled</h4>
                        <p className="text-3xl font-bold text-teal-900 mt-2">18</p>
                    </div>
                </div>
            </motion.section>

            {/* Activity Feed */}
            <motion.section
                ref={activityRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: activityInView ? 1 : 0, scale: activityInView ? 1 : 0.95 }}
                transition={{ duration: 0.6 }}
                className="p-10 bg-white rounded-2xl shadow-lg border border-teal-100"
            >
                <h3 className="font-semibold text-2xl text-teal-900 mb-6">Recent Activity</h3>
                <ul className="space-y-5 text-gray-700">
                    <li className="flex items-start gap-3">
                        <span className="text-teal-600 font-medium">You</span>
                        <span>scheduled an interview with Julia Tran for Monday at 10 AM for the Product Manager role.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-teal-600 font-medium">Robert Scott</span>
                        <span>was moved to the “Interview” stage for the Senior Developer position.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-teal-600 font-medium">New job</span>
                        <span>posted: “Senior React Developer” with 25 applications received so far.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-teal-600 font-medium">System</span>
                        <span>updated analytics dashboard with new hiring metrics and trends.</span>
                    </li>
                </ul>
            </motion.section>

            {/* Quick Notes */}
            <motion.section
                ref={notesRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: notesInView ? 1 : 0, scale: notesInView ? 1 : 0.95 }}
                transition={{ duration: 0.6 }}
                className="p-10 bg-white rounded-2xl shadow-lg border border-teal-100"
            >
                <h3 className="font-semibold text-2xl text-teal-900 mb-6">Quick Notes</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-lg bg-teal-50 border border-teal-200">
                        Follow up with backend developer candidates by end of week to finalize interviews.
                    </div>
                    <div className="p-5 rounded-lg bg-teal-50 border border-teal-200">
                        Call scheduled with Julia Tran — Friday at 2 PM to discuss project details and expectations.
                    </div>
                    <div className="p-5 rounded-lg bg-teal-50 border border-teal-200">
                        Review updated candidate profiles for the UX Designer role before Monday’s meeting.
                    </div>
                    <div className="p-5 rounded-lg bg-teal-50 border border-teal-200">
                        Prepare feedback for the hiring team based on recent analytics insights.
                    </div>
                </div>
            </motion.section>
        </main>
    );
}