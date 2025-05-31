// const TextField = ({ label: any, ...props }) => (
//     <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <input {...props}
//                className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"/>
//     </div>
// );

import React, { InputHTMLAttributes } from 'react';

type TextFieldProps = {
    label: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ label, ...props }: TextFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                {...props}
                className="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
    );
}