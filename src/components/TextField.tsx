import React, { InputHTMLAttributes } from 'react';

type TextFieldProps = {
    label?: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ label, error, ...props }: TextFieldProps) {
    const baseClasses =
        'w-full p-3 border rounded-lg outline-none focus:ring-2';
    const errorClasses = error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500';

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`${baseClasses} ${errorClasses}`}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
