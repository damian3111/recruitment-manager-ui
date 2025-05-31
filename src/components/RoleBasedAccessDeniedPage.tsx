'use client';

import { motion } from 'framer-motion';
import { Settings, Lock } from 'lucide-react';
import React from 'react';

interface User {
    id: string;
    role: string;
}

interface Props {
    role: string; // e.g., "recruiter" or "recruiter or candidate"
    asd: string;  // e.g., "Messages" or "Settings" for page context
}

export default function RoleBasedAccessDeniedPage({ role }: { role: string }) {

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-8 sm:px-6 lg:px-8">
        <>
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mb-6"
                    >
                        <Lock className="w-16 h-16 text-gray-700" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 text-lg text-center max-w-md">
                        This page is only available to {role}. Please log in with an authorized account.
                    </p>
                </>
        </div>
    );
}