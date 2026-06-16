"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { BranchRecord } from "@/types/branches";
import type { SchoolClassRecord, SystemUserRecord } from "@/types/user-management";

export interface ClassFormValues {
    name: string;
    branch_id: string;
    teacher_profile_id: string;
    capacity: number | "";
    room_number: string;
}

interface ClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: ClassFormValues) => Promise<void>;
    classRecord?: Partial<SchoolClassRecord> | null;
    teachers?: SystemUserRecord[];
    branches?: BranchRecord[];
    isSubmitting?: boolean;
}

const emptyForm: ClassFormValues = {
    name: "",
    branch_id: "",
    teacher_profile_id: "",
    capacity: "",
    room_number: "",
};

const ClassModal: React.FC<ClassModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    classRecord = null,
    teachers = [],
    branches = [],
    isSubmitting = false,
}) => {
    const [formData, setFormData] = React.useState<ClassFormValues>(emptyForm);

    React.useEffect(() => {
        if (!isOpen) return;
        setFormData({
            name: classRecord?.name || "",
            branch_id: classRecord?.branch_id || "",
            teacher_profile_id: classRecord?.teacher_profile_id || "",
            capacity: classRecord?.capacity ?? "",
            room_number: classRecord?.room_number || "",
        });
    }, [classRecord, isOpen]);

    const handleChange = (field: keyof ClassFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({
            ...current,
            [field]: field === "capacity" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{classRecord ? "Edit Class" : "Add New Class"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create an academic section, assign a teacher, and link it to a branch.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="className">Class Name</Label>
                        <Input id="className" placeholder="e.g. Grade 10-A" name="name" type="text" value={formData.name} onChange={handleChange("name")} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="classBranch">Branch</Label>
                            <select id="classBranch" value={formData.branch_id} onChange={handleChange("branch_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Branch</option>
                                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="classTeacher">Class Teacher</Label>
                            <select id="classTeacher" value={formData.teacher_profile_id} onChange={handleChange("teacher_profile_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="capacity">Max Capacity</Label>
                            <Input id="capacity" placeholder="e.g. 40" name="capacity" type="number" value={formData.capacity} onChange={handleChange("capacity")} />
                        </div>
                        <div>
                            <Label htmlFor="roomNumber">Room Number</Label>
                            <Input id="roomNumber" placeholder="e.g. Room 302" name="roomNumber" type="text" value={formData.room_number} onChange={handleChange("room_number")} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60">
                            {isSubmitting ? "Saving..." : classRecord ? "Save Changes" : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ClassModal;
