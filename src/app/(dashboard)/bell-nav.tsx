'use client';

import { Bell} from 'lucide-react';
import { useState } from 'react';

export function BellNav() {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className={"px-6"}>
        <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-500 hover:text-indigo-500"
        >
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
    {showNotifications && (
        <div className="absolute right-14 top-12 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg w-64 z-30">
            <div className="p-3 font-semibold text-gray-800 dark:text-gray-100">Notifications</div>
            <ul className="divide-y dark:divide-gray-700">
                <li className="p-3 text-sm text-gray-600 dark:text-gray-300">🔔 New application received</li>
                <li className="p-3 text-sm text-gray-600 dark:text-gray-300">📢 System maintenance on Sunday</li>
                <li className="p-3 text-sm text-gray-600 dark:text-gray-300">👤 Profile updated</li>
            </ul>
        </div>
    )}

        </div>)
}