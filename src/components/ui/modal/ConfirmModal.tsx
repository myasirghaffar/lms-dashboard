"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "danger",
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
            <div className="p-8">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-6 mx-auto">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{message}</p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-700"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-lg ${variant === "danger"
                                ? "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none"
                                : "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200 dark:shadow-none"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
