"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { getTeachers, getUsers } from "@/lib/api";

interface ClassModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose }) => {
    const teachers = getTeachers();
    const users = getUsers();

    const teacherOptions = teachers.map(t => {
        const user = users.find(u => u.id === t.userId);
        return { label: user?.name || "Unknown Teacher", value: t.id };
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle class creation logic here
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Class</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create a new academic section and assign a teacher.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="className">Class Name</Label>
                        <Input
                            id="className"
                            placeholder="e.g. Grade 10-A"
                            name="name"
                            type="text"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="classTeacher">Assign Teacher</Label>
                        <Select
                            id="classTeacher"
                            options={teacherOptions}
                            placeholder="Select Class Teacher"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="capacity">Max Capacity</Label>
                            <Input
                                id="capacity"
                                placeholder="e.g. 40"
                                name="capacity"
                                type="number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="roomNumber">Room Number</Label>
                            <Input
                                id="roomNumber"
                                placeholder="e.g. Room 302"
                                name="roomNumber"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            Create Class
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClassModal;
