"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import ProfileImageUpload from "@/components/dashboard/users/ProfileImageUpload";
import type { BranchRecord } from "@/types/branches";
import type { SchoolClassRecord, StudentManagementRecord, SystemUserRecord } from "@/types/user-management";

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'add' | 'edit' | 'view';
    initialData?: Partial<StudentManagementRecord> | null;
    classes?: SchoolClassRecord[];
    branches?: BranchRecord[];
    parents?: SystemUserRecord[];
    onSubmit?: (values: StudentFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

export interface StudentFormValues {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    profile_image: string;
    branch_id: string;
    roll_number: string;
    class_id: string;
    parent_profile_id: string;
    father_name: string;
    previous_balance: number;
    monthly_fee: number;
}

const emptyForm: StudentFormValues = {
    name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_image: "",
    branch_id: "",
    roll_number: "",
    class_id: "",
    parent_profile_id: "",
    father_name: "",
    previous_balance: 0,
    monthly_fee: 0,
};

const StudentModal: React.FC<StudentModalProps> = ({
    isOpen,
    onClose,
    mode = 'add',
    initialData = null,
    classes = [],
    branches = [],
    parents = [],
    onSubmit,
    isSubmitting = false,
}) => {
    const isViewOnly = mode === 'view';
    const [formData, setFormData] = React.useState<StudentFormValues>(emptyForm);

    React.useEffect(() => {
        if (!isOpen) return;

        setFormData({
            name: initialData?.name || "",
            email: initialData?.email || "",
            phone_number: initialData?.phone_number || "",
            address: initialData?.address || "",
            profile_image: initialData?.profile_image || "",
            branch_id: initialData?.branch_id || "",
            roll_number: initialData?.roll_number || "",
            class_id: initialData?.class_id || "",
            parent_profile_id: initialData?.parent_profile_id || "",
            father_name: initialData?.father_name || "",
            previous_balance: initialData?.previous_balance || 0,
            monthly_fee: initialData?.monthly_fee || 0,
        });
    }, [initialData, isOpen]);

    const handleChange = (field: keyof StudentFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({
            ...current,
            [field]: field === "previous_balance" || field === "monthly_fee" ? Number(e.target.value || 0) : e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly) return;
        await onSubmit?.(formData);
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
                                value={formData.name}
                                onChange={handleChange("name")}
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
                                value={formData.roll_number}
                                onChange={handleChange("roll_number")}
                                disabled={isViewOnly}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="studentBranch">Branch</Label>
                            <select
                                id="studentBranch"
                                value={formData.branch_id}
                                onChange={handleChange("branch_id")}
                                disabled={isViewOnly}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="studentClass">Class</Label>
                            <select
                                id="studentClass"
                                value={formData.class_id}
                                onChange={handleChange("class_id")}
                                disabled={isViewOnly}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value="">Select Class</option>
                                {classes.map((schoolClass) => (
                                    <option key={schoolClass.id} value={schoolClass.id}>
                                        {schoolClass.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="studentEmail">Email Address</Label>
                            <Input
                                id="studentEmail"
                                placeholder="e.g. jane@example.com"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange("email")}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div>
                            <Label htmlFor="parentProfile">Parent</Label>
                            <select
                                id="parentProfile"
                                value={formData.parent_profile_id}
                                onChange={handleChange("parent_profile_id")}
                                disabled={isViewOnly}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value="">Select Parent</option>
                                {parents.map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="fatherName">Father Name</Label>
                            <Input
                                id="fatherName"
                                placeholder="e.g. Ahmad Khan"
                                name="fatherName"
                                type="text"
                                value={formData.father_name}
                                onChange={handleChange("father_name")}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                placeholder="0300-0000000"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phone_number}
                                onChange={handleChange("phone_number")}
                                disabled={isViewOnly}
                            />
                        </div>
                        <ProfileImageUpload
                            value={formData.profile_image}
                            onChange={(url) => setFormData((current) => ({ ...current, profile_image: url }))}
                            disabled={isViewOnly}
                        />
                    </div>

                    <div>
                        <Label htmlFor="studentAddress">Address</Label>
                        <Input
                            id="studentAddress"
                            placeholder="Student address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange("address")}
                            disabled={isViewOnly}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="monthlyFee">Monthly Fee</Label>
                            <Input
                                id="monthlyFee"
                                name="monthlyFee"
                                type="number"
                                value={formData.monthly_fee}
                                onChange={handleChange("monthly_fee")}
                                disabled={isViewOnly}
                            />
                        </div>
                        <div>
                            <Label htmlFor="previousBalance">Previous Balance</Label>
                            <Input
                                id="previousBalance"
                                name="previousBalance"
                                type="number"
                                value={formData.previous_balance}
                                onChange={handleChange("previous_balance")}
                                disabled={isViewOnly}
                            />
                        </div>
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
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Enroll Student'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default StudentModal;
