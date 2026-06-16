"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import ProfileImageUpload from "@/components/dashboard/users/ProfileImageUpload";
import type { BranchRecord } from "@/types/branches";
import type { SystemUserRecord, TeacherManagementRecord } from "@/types/user-management";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleType?: string; // 'ADMIN' | 'PRINCIPAL' | 'TEACHER' | etc.
    mode?: "add" | "edit";
    initialData?: Partial<SystemUserRecord & TeacherManagementRecord> | null;
    onSubmit?: (values: UserFormValues) => Promise<void>;
    isSubmitting?: boolean;
    branches?: BranchRecord[];
}

export interface UserFormValues {
    name: string;
    email: string;
    phone_number: string;
    address: string;
    profile_image: string;
    branch_id: string;
    role: string;
    specialization?: string;
}

const emptyForm: UserFormValues = {
    name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_image: "",
    branch_id: "",
    role: "ADMIN",
    specialization: "",
};

const getDefaultRole = (roleType: string) => {
    if (roleType === "PRINCIPAL") return "BRANCH_ADMIN";
    if (roleType === "TEACHER") return "TEACHER";
    if (roleType === "PARENT") return "PARENT";
    return "ADMIN";
};

const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    roleType = "ADMIN",
    mode = "add",
    initialData = null,
    onSubmit,
    isSubmitting = false,
    branches = [],
}) => {
    const [formData, setFormData] = React.useState<UserFormValues>({
        ...emptyForm,
        role: getDefaultRole(roleType),
    });

    React.useEffect(() => {
        if (!isOpen) return;

        setFormData({
            name: initialData?.name || "",
            email: initialData?.email || "",
            phone_number: initialData?.phone_number || "",
            address: initialData?.address || "",
            profile_image: initialData?.profile_image || "",
            branch_id: initialData?.branch_id || "",
            role: initialData?.role || getDefaultRole(roleType),
            specialization: initialData?.specialization || "",
        });
    }, [initialData, isOpen, roleType]);

    const handleChange = (field: keyof UserFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((current) => ({
            ...current,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit?.(formData);
    };

    const roleLabel = roleType.charAt(0).toUpperCase() + roleType.slice(1).toLowerCase();
    const isEdit = mode === "edit";

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit" : "Add New"} {roleLabel}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{isEdit ? "Update this user profile." : `Provide the user details below to create a new ${roleLabel.toLowerCase()} profile.`}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="userName">Full Name</Label>
                            <Input
                                id="userName"
                                placeholder="e.g. John Doe"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange("name")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="userEmail">Email Address</Label>
                            <Input
                                id="userEmail"
                                placeholder="e.g. john@example.com"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange("email")}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="userPhone">Phone Number</Label>
                            <Input
                                id="userPhone"
                                placeholder="+1 234 567 890"
                                name="phone"
                                type="tel"
                                value={formData.phone_number}
                                onChange={handleChange("phone_number")}
                            />
                        </div>
                        {roleType === 'ADMIN' && (
                            <div>
                                <Label htmlFor="userRole">Specific Role</Label>
                                <Select
                                    id="userRole"
                                    key={formData.role}
                                    options={[
                                        { label: 'Admin', value: 'ADMIN' },
                                        { label: 'Super Admin', value: 'SUPER_ADMIN' },
                                    ]}
                                    defaultValue={formData.role}
                                    onChange={(value) => setFormData((current) => ({ ...current, role: value }))}
                                />
                            </div>
                        )}
                        {roleType === 'TEACHER' && (
                            <div>
                                <Label htmlFor="specialization">Specialization</Label>
                                <Input
                                    id="specialization"
                                    placeholder="e.g. Mathematics"
                                    name="specialization"
                                    type="text"
                                    value={formData.specialization}
                                    onChange={handleChange("specialization")}
                                />
                            </div>
                        )}
                    </div>

                    {roleType === 'TEACHER' && (
                        <div>
                            <Label htmlFor="teacherBranch">Branch</Label>
                            <select
                                id="teacherBranch"
                                value={formData.branch_id}
                                onChange={(e) => setFormData((current) => ({ ...current, branch_id: e.target.value }))}
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
                    )}

                    <div>
                        <Label htmlFor="userAddress">Address</Label>
                        <Input
                            id="userAddress"
                            placeholder="e.g. 123 Street Name, City"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange("address")}
                        />
                    </div>

                    <ProfileImageUpload
                        value={formData.profile_image}
                        onChange={(url) => setFormData((current) => ({ ...current, profile_image: url }))}
                    />

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
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : `Create ${roleLabel}`}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UserModal;
