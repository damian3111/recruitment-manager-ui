'use client';

import { useParams } from 'next/navigation'; // Use useParams instead of useSearchParams
import { useConfirmEmail } from '@/lib/emailService'; // Adjust path as needed
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import { AxiosError } from 'axios'; // For proper error typing
import Image from 'next/image';
import Link from 'next/link';

export default function ConfirmEmailPage() {
    const params = useParams();
    const token = params?.token; // Get token from dynamic route

    if (!token || typeof token !== 'string') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <IconExclamationCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Link</h1>
                    <p className="text-gray-600 mb-6">No token provided. Please check your email for the correct confirmation link.</p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const { data, isLoading, isError, error } = useConfirmEmail(token);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirming Your Email</h1>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center">
                        <IconExclamationCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirmation Failed</h1>
                        <p className="text-gray-600 mb-6">
                            {parseMessage(
                                'An error occurred during confirmation.'
                            )}
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <IconCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmed!</h1>
                        <p className="text-gray-600 mb-6">{parseMessage(data || 'Your email has been successfully verified.')}</p>
                        <Link
                            href="/login" // Adjust to your login or dashboard route
                            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
                {/* Optional branding footer */}
                <div className="mt-8 text-gray-500 text-sm">
                    <p>Powered by YourAppName</p>
                    {/* Replace with your logo or remove if not needed */}
                    {/* <Image src="/logo.png" alt="YourAppName" width={100} height={30} className="mx-auto mt-2" /> */}
                </div>
            </div>
        </div>
    );
}

function parseMessage(response: string): string {
    const parts = response.split('\n\n');
    if (parts.length > 1 && parts[0] === 'Temporary Email Confirmation Page') {
        return parts[1].replace('Message: ', '');
    }
    return response;
}