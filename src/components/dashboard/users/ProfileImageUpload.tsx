"use client";

import React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getProfileImageSrc } from "@/lib/profileImage";

interface ProfileImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    disabled?: boolean;
    label?: string;
}

const BUCKET_NAME = "profile-images";

function getFilePath(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40) || "profile";

    return `profiles/${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
    value,
    onChange,
    disabled = false,
    label = "Profile Image",
}) => {
    const inputId = React.useId();
    const [isUploading, setIsUploading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please select an image file.");
            return;
        }

        setIsUploading(true);
        setErrorMessage("");

        const filePath = getFilePath(file);
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            });

        if (error) {
            setErrorMessage(error.message);
            setIsUploading(false);
            return;
        }

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        onChange(data.publicUrl);
        setIsUploading(false);
    };

    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor={inputId}>
                {label}
            </label>
            <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    {value ? (
                        <Image src={getProfileImageSrc(value, "Profile preview")} alt="Profile preview" fill className="object-cover" />
                    ) : (
                        <ImagePlus className="h-6 w-6 text-gray-400" />
                    )}
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    <label
                        htmlFor={inputId}
                        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 ${disabled || isUploading ? "pointer-events-none opacity-60" : ""}`}
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {isUploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
                    </label>
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            <X className="h-4 w-4" />
                            Remove
                        </button>
                    )}
                    <input
                        id={inputId}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="sr-only"
                        disabled={disabled || isUploading}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            {errorMessage && (
                <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{errorMessage}</p>
            )}
        </div>
    );
};

export default ProfileImageUpload;
