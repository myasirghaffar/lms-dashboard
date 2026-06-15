"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { BranchFormValues, BranchRecord } from "@/types/branches";

interface AddBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: BranchFormValues) => Promise<void>;
    branch?: BranchRecord | null;
    isSubmitting?: boolean;
}

const emptyForm: BranchFormValues = {
    name: "",
    address: "",
    phone_number: "",
    email: "",
    principal_name: "",
    status: "active",
};

const AddBranchModal: React.FC<AddBranchModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    branch = null,
    isSubmitting = false,
}) => {
    const [formData, setFormData] = React.useState<BranchFormValues>(emptyForm);

    React.useEffect(() => {
        if (!isOpen) return;

        if (branch) {
            setFormData({
                name: branch.name,
                address: branch.address,
                phone_number: branch.phone_number,
                email: branch.email,
                principal_name: branch.principal_name,
                status: branch.status,
            });
        } else {
            setFormData(emptyForm);
        }
    }, [branch, isOpen]);

    const handleChange = (field: keyof BranchFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({
            ...current,
            [field]: e.target.value,
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {branch ? "Edit Branch" : "Add New Branch"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {branch ? "Update campus details and branch status." : "Fill in the details to create a new school branch."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                            id="branchName"
                            placeholder="e.g. Main Branch"
                            name="branchName"
                            type="text"
                            defaultValue={formData.name}
                            onChange={handleChange("name")}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Branch Address</Label>
                        <Input
                            id="address"
                            placeholder="e.g. 123 Education Blvd"
                            name="address"
                            type="text"
                            defaultValue={formData.address}
                            onChange={handleChange("address")}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="+1 234 567 890"
                                name="phone"
                                type="tel"
                                defaultValue={formData.phone_number}
                                onChange={handleChange("phone_number")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="principal">Principal Name</Label>
                            <Input
                                id="principal"
                                placeholder="Full Name"
                                name="principal"
                                type="text"
                                defaultValue={formData.principal_name}
                                onChange={handleChange("principal_name")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="email">Branch Email</Label>
                            <Input
                                id="email"
                                placeholder="branch@school.com"
                                name="email"
                                type="email"
                                defaultValue={formData.email}
                                onChange={handleChange("email")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange("status")}
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                <option value="active">Active</option>
                                <option value="disabled">Disabled</option>
                            </select>
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
                            disabled={isSubmitting}
                            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            {isSubmitting ? "Saving..." : branch ? "Save Changes" : "Create Branch"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddBranchModal;
