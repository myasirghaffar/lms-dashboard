"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { getClasses } from "@/lib/api";

import { Student } from "@/types";

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'add' | 'edit' | 'view';
    initialData?: any; // Using any to match the joined data in students/page.tsx
}

const StudentModal: React.FC<StudentModalProps> = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData
}) => {
    const classes = getClasses();
    const isViewOnly = mode === 'view';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly) return;
        // Handle student saving logic here
        onClose();
    };

    const getTitle = () => {
        if (mode === 'view') return 'Student Details';
        if (mode === 'edit') return 'Edit Student';
        return 'Add New Student';
    };

    const getDescription = () => {
        if (mode === 'view') return 'Viewing student enrollment record.';
        if (mode === 'edit') return 'Update the student information below.';
        return 'Enroll a new student into the system.';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{getDescription()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="studentName">Full Name</Label>
                            <Input
                                id="studentName"
                                placeholder="e.g. Jane Doe"
                                name="name"
                                type="text"
                                required
                                defaultValue={initialData?.name}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div>
                            <Label htmlFor="rollNumber">Roll Number</Label>
                            <Input
                                id="rollNumber"
                                placeholder="e.g. STD-001"
                                name="rollNumber"
                                type="text"
                                required
                                defaultValue={initialData?.rollNumber}
                                disabled={isViewOnly}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="studentClass">Class</Label>
                            <Select
                                id="studentClass"
                                options={classes.map(c => ({ label: c.name, value: c.id }))}
                                placeholder="Select Class"
                                defaultValue={initialData?.classId}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div>
                            <Label htmlFor="studentEmail">Email Address</Label>
                            <Input
                                id="studentEmail"
                                placeholder="e.g. jane@example.com"
                                name="email"
                                type="email"
                                defaultValue={initialData?.email}
                                disabled={isViewOnly}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="parentEmail">Parent Email / ID</Label>
                        <Input
                            id="parentEmail"
                            placeholder="Link to parent account"
                            name="parent"
                            type="text"
                            defaultValue={initialData?.parentId}
                            disabled={isViewOnly}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            {isViewOnly ? 'Close' : 'Cancel'}
                        </button>
                        {!isViewOnly && (
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                            >
                                {mode === 'edit' ? 'Save Changes' : 'Enroll Student'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default StudentModal;
