'use client';

import { motion } from 'framer-motion';
import {Wrench} from 'lucide-react';
import React from "react";

export default function UnderConstructionPage() {
    return (
        <div className=" p-52 px-52 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mb-6"
            >
                <Wrench className="w-16 h-16 text-gray-700" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
                Page Under Construction
            </h1>
            <p className="text-gray-600 text-lg text-center max-w-md">
                We're currently working on this page to make it perfect for you. Please check back soon!
            </p>
        </div>
    );
}
