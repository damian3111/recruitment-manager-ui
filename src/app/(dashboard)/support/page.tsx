'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HelpCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import Link from 'next/link';

// FAQ data (customizable)
const faqs = [
    {
        id: 1,
        question: 'How do I reset my password?',
        answer:
            'To reset your password, go to the settings page, click "Account," and select "Reset Password." Follow the instructions sent to your email.',
    },
    {
        id: 2,
        question: 'How can I contact support?',
        answer:
            'You can submit a support request using the form on this page or email us at support@recruitmentmanager.com.',
    },
    {
        id: 3,
        question: 'What file formats are supported for uploads?',
        answer: 'We support PDF, DOCX, and TXT files for resume and document uploads.',
    },
];

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    // Handle form input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Simulate API call to submit support request
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
            toast.success('Support request submitted successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error('Failed to submit support request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle FAQ accordion
    const toggleFaq = (id: number) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <div className="flex gap-8 py-8  max-w-[100em] mx-auto min-h-screen">
            {/* Contact Form Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-[100em] bg-white rounded-2xl shadow-2xl p-10 border border-gray-200 sticky top-8 h-[calc(100vh-4rem)] flex flex-col"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 w-96 flex items-center gap-3">
                    <HelpCircle className="h-8 w-8 text-blue-700" />
                    Contact Support
                </h2>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                            Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="mt-2 w-full rounded-lg border-gray-300 focus:ring-blue-600 focus:border-blue-600 text-base py-3"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                            Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            className="mt-2 w-full rounded-lg border-gray-300 focus:ring-blue-600 focus:border-blue-600 text-base py-3"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-800">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Subject of your request"
                            className="mt-2 w-full rounded-lg border-gray-300 focus:ring-blue-600 focus:border-blue-600 text-base py-3"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-800">
                            Message
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Describe your issue or question..."
                            className="mt-2 w-full rounded-lg border-gray-300 focus:ring-blue-600 focus:border-blue-600 text-base py-3 min-h-[200px] resize-none"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 text-lg py-6 font-semibold disabled:opacity-50 shadow-md"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Or email us directly at{' '}
                        <a
                            href="mailto:support@recruitmentmanager.com"
                            className="text-blue-700 hover:underline font-medium"
                        >
                            support@recruitmentmanager.com
                        </a>
                    </p>
                </div>
            </motion.div>

            {/* FAQ Section */}
            <div className="flex-1 max-w-[64rem] mx-auto space-y-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-4xl font-bold text-gray-900 tracking-tight"
                >
                    Support & FAQs
                </motion.h1>
                <AnimatePresence>
                    {faqs.map((faq) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="w-full rounded-2xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-900 w-[130em]">{faq.question}</h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleFaq(faq.id)}
                                            aria-label={expandedFaq === faq.id ? 'Collapse FAQ' : 'Expand FAQ'}
                                            className="ml-4"
                                        >
                                            {expandedFaq === faq.id ? (
                                                <ChevronUp className="h-6 w-6 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="h-6 w-6 text-gray-600" />
                                            )}
                                        </motion.button>
                                    </div>
                                    <AnimatePresence>
                                        {expandedFaq === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                className="mt-4 text-gray-600 text-base leading-relaxed"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mt-10"
                >
                    <Button
                        asChild
                        className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 text-lg font-semibold shadow-md"
                    >
                        <Link href="https://docs.recruitmentmanager.com" target="_blank">
                            View Full Documentation
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}