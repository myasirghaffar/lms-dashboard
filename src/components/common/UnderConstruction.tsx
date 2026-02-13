import React from 'react';
import { Construction } from 'lucide-react';

interface UnderConstructionProps {
    title: string;
    description?: string;
}

export default function UnderConstruction({ title, description }: UnderConstructionProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {description || "This module is currently under development. Check back soon for updates!"}
            </p>

            <div className="mt-8 flex gap-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Notify Me
                </button>
                <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Go Back
                </button>
            </div>
        </div>
    );
}
