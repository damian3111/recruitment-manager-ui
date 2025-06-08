'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-gray-600 mb-6 text-sm md:text-base">
                    We encountered an issue while processing your request. Please try again or follow the instructions below to resolve the issue.
                </p>

                {error?.message && (
                    <div className="mb-6 text-left">
                        <p className="text-sm text-gray-500 font-medium mb-2">Error Details:</p>
                        <pre className="bg-gray-900 text-white text-xs md:text-sm p-4 rounded-lg overflow-auto">
              {error.message}
                            {error.digest && `\nDigest: ${error.digest}`}
            </pre>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <button
                        onClick={reset}
                        className="bg-green-600 text cerimonia hover:bg-green-700 py-2 px-6 rounded-lg font-medium transition-colors duration-200"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/support"
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 py-2 px-6 rounded-lg font-medium transition-colors duration-200"
                    >
                        Contact Support
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-500">
                    © {new Date().getFullYear()} Recruitment Manager. All rights reserved.
                </p>
            </div>
        </main>
    );
}