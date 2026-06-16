"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { SchoolClassRecord, SubjectRecord, SystemUserRecord } from "@/types/user-management";

export interface SubjectFormValues {
    name: string;
    description: string;
    class_id: string;
    teacher_profile_id: string;
    branch_id: string;
}

interface SubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: SubjectFormValues) => Promise<void>;
    subject?: Partial<SubjectRecord> | null;
    classes?: SchoolClassRecord[];
    teachers?: SystemUserRecord[];
    isSubmitting?: boolean;
}

const emptyForm: SubjectFormValues = {
    name: "",
    description: "",
    class_id: "",
    teacher_profile_id: "",
    branch_id: "",
};

const SubjectModal: React.FC<SubjectModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    subject = null,
    classes = [],
    teachers = [],
    isSubmitting = false,
}) => {
    const [formData, setFormData] = React.useState<SubjectFormValues>(emptyForm);

    React.useEffect(() => {
        if (!isOpen) return;
        setFormData({
            name: subject?.name || "",
            description: subject?.description || "",
            class_id: subject?.class_id || "",
            teacher_profile_id: subject?.teacher_profile_id || "",
            branch_id: subject?.branch_id || "",
        });
    }, [isOpen, subject]);

    const handleChange = (field: keyof SubjectFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((current) => {
            if (field === "class_id") {
                const selectedClass = classes.find((item) => item.id === value);
                return { ...current, class_id: value, branch_id: selectedClass?.branch_id || "" };
            }
            return { ...current, [field]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{subject ? "Edit Subject" : "Add New Subject"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create a subject and assign it to a class and teacher.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="subjectName">Subject Name</Label>
                        <Input id="subjectName" placeholder="e.g. Mathematics" name="name" type="text" value={formData.name} onChange={handleChange("name")} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="subjectClass">Class</Label>
                            <select id="subjectClass" value={formData.class_id} onChange={handleChange("class_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Class</option>
                                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="subjectTeacher">Teacher</Label>
                            <select id="subjectTeacher" value={formData.teacher_profile_id} onChange={handleChange("teacher_profile_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="Brief overview of the subject" name="description" type="text" value={formData.description} onChange={handleChange("description")} />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60">
                            {isSubmitting ? "Saving..." : subject ? "Save Changes" : "Create Subject"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default SubjectModal;
