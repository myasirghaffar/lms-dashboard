import { UserRole } from '@prisma/client';

export type { UserRole };

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    phoneNumber: string | null;
    address: string | null;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Branch {
    id: string;
    name: string;
    address: string | null;
    phoneNumber: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Student {
    id: string;
    userId: string;
    parentId: string | null;
    branchId: string;
    rollNumber: string;
    user?: User;
    branch?: Branch;
}

export interface Teacher {
    id: string;
    userId: string;
    branchId: string;
    specialization: string | null;
    user?: User;
    branch?: Branch;
}

export interface Class {
    id: string;
    name: string;
    branchId: string;
    teacherId: string | null;
}

export interface Subject {
    id: string;
    name: string;
    classId: string;
    teacherId: string | null;
}

export interface Attendance {
    id: string;
    studentId: string;
    date: Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    remarks: string | null;
    createdAt: Date;
}

export interface Exam {
    id: string;
    name: string;
    date: Date;
    subjectId: string;
    weightage: number;
}

export interface Mark {
    id: string;
    studentId: string;
    examId: string;
    score: number;
    remarks: string | null;
}

export interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    subjectId: string;
    teacherId: string;
    fileUrl: string | null;
}

export interface FeeStatus {
    id: string;
    studentId: string;
    title: string;
    amount: number;
    paid: number;
    status: 'PAID' | 'UNPAID' | 'PARTIAL';
    dueDate: Date;
    updatedAt: Date;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    branchId: string | null;
    target: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS';
    createdAt: Date;
}

export interface DashboardStats {
    totalStudents?: number;
    totalTeachers?: number;
    totalBranches?: number;
    attendancePercentage?: number;
    pendingFees?: number;
    upcomingExams?: number;
}
