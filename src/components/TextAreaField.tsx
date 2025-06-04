import React, { TextareaHTMLAttributes } from 'react';

type TextAreaFieldProps = {
    label?: string;
    error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextAreaField({ label, ...props }: TextAreaFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                {...props}
                className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
    );
}