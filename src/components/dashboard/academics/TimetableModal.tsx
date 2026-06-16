"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { SchoolClassRecord, SubjectRecord, SystemUserRecord, TimetableEntryRecord } from "@/types/user-management";

export interface TimetableFormValues {
    class_id: string;
    subject_id: string;
    teacher_profile_id: string;
    branch_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room_number: string;
}

interface TimetableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: TimetableFormValues) => Promise<void>;
    entry?: Partial<TimetableEntryRecord> | null;
    classes?: SchoolClassRecord[];
    subjects?: SubjectRecord[];
    teachers?: SystemUserRecord[];
    isSubmitting?: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const emptyForm: TimetableFormValues = {
    class_id: "",
    subject_id: "",
    teacher_profile_id: "",
    branch_id: "",
    day_of_week: "Monday",
    start_time: "",
    end_time: "",
    room_number: "",
};

const TimetableModal: React.FC<TimetableModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    entry = null,
    classes = [],
    subjects = [],
    teachers = [],
    isSubmitting = false,
}) => {
    const [formData, setFormData] = React.useState<TimetableFormValues>(emptyForm);

    React.useEffect(() => {
        if (!isOpen) return;
        setFormData({
            class_id: entry?.class_id || "",
            subject_id: entry?.subject_id || "",
            teacher_profile_id: entry?.teacher_profile_id || "",
            branch_id: entry?.branch_id || "",
            day_of_week: entry?.day_of_week || "Monday",
            start_time: entry?.start_time?.slice(0, 5) || "",
            end_time: entry?.end_time?.slice(0, 5) || "",
            room_number: entry?.room_number || "",
        });
    }, [entry, isOpen]);

    const filteredSubjects = formData.class_id
        ? subjects.filter((subject) => subject.class_id === formData.class_id)
        : subjects;

    const handleChange = (field: keyof TimetableFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((current) => {
            if (field === "class_id") {
                const selectedClass = classes.find((item) => item.id === value);
                return {
                    ...current,
                    class_id: value,
                    branch_id: selectedClass?.branch_id || "",
                    subject_id: "",
                    room_number: selectedClass?.room_number || current.room_number,
                };
            }

            if (field === "subject_id") {
                const selectedSubject = subjects.find((item) => item.id === value);
                return {
                    ...current,
                    subject_id: value,
                    teacher_profile_id: selectedSubject?.teacher_profile_id || current.teacher_profile_id,
                    branch_id: selectedSubject?.branch_id || current.branch_id,
                };
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{entry ? "Edit Period" : "Add Period"}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Assign a subject, teacher, day, and time slot.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="timeClass">Class</Label>
                            <select id="timeClass" value={formData.class_id} onChange={handleChange("class_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Class</option>
                                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="timeSubject">Subject</Label>
                            <select id="timeSubject" value={formData.subject_id} onChange={handleChange("subject_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Subject</option>
                                {filteredSubjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="timeTeacher">Teacher</Label>
                            <select id="timeTeacher" value={formData.teacher_profile_id} onChange={handleChange("teacher_profile_id")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                <option value="">Select Teacher</option>
                                {teachers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="dayOfWeek">Day</Label>
                            <select id="dayOfWeek" value={formData.day_of_week} onChange={handleChange("day_of_week")} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                                {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="startTime">Start</Label>
                            <Input id="startTime" type="time" value={formData.start_time} onChange={handleChange("start_time")} required />
                        </div>
                        <div>
                            <Label htmlFor="endTime">End</Label>
                            <Input id="endTime" type="time" value={formData.end_time} onChange={handleChange("end_time")} required />
                        </div>
                        <div>
                            <Label htmlFor="timeRoom">Room</Label>
                            <Input id="timeRoom" value={formData.room_number} onChange={handleChange("room_number")} placeholder="Room 101" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60">
                            {isSubmitting ? "Saving..." : entry ? "Save Changes" : "Create Period"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TimetableModal;
