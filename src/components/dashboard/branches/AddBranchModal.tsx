"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface AddBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle branch creation logic here
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Branch</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to create a new school branch.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                            id="branchName"
                            placeholder="e.g. Main Branch"
                            name="branchName"
                            type="text"
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Branch Address</Label>
                        <Input
                            id="address"
                            placeholder="e.g. 123 Education Blvd"
                            name="address"
                            type="text"
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
                            />
                        </div>
                        <div>
                            <Label htmlFor="principal">Principal Name</Label>
                            <Input
                                id="principal"
                                placeholder="Full Name"
                                name="principal"
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
                            Create Branch
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddBranchModal;
