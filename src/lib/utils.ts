import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function calculatePercentage(obtained: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
}

export function getGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

export function generateRollNumber(branchId: string, classId: string, studentNumber: number): string {
    const branchCode = branchId.substring(0, 3).toUpperCase();
    const classCode = classId.substring(0, 2).toUpperCase();
    const studentNum = studentNumber.toString().padStart(4, '0');
    return `${branchCode}-${classCode}-${studentNum}`;
}
