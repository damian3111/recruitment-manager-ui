import React from 'react';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    description?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                       open,
                                                       title = "Are you sure?",
                                                       description = "Do you really want to do this? This action cannot be undone.",
                                                       onCancel,
                                                       onConfirm,
                                                   }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
                <p className="text-gray-600 mb-6">{description}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Yes, do it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
