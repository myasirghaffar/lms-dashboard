import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['SUPER_ADMIN', 'BRANCH_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
});

// Student validation schemas
export const createStudentSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    branchId: z.string().uuid('Invalid branch ID'),
    rollNumber: z.string().min(1, 'Roll number is required'),
    parentId: z.string().uuid().optional(),
});

export const updateStudentSchema = z.object({
    name: z.string().min(2).optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    rollNumber: z.string().optional(),
    parentId: z.string().uuid().optional(),
});

// Teacher validation schemas
export const createTeacherSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    branchId: z.string().uuid('Invalid branch ID'),
    specialization: z.string().optional(),
});

// Branch validation schemas
export const createBranchSchema = z.object({
    name: z.string().min(2, 'Branch name must be at least 2 characters'),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
});

// Class validation schemas
export const createClassSchema = z.object({
    name: z.string().min(1, 'Class name is required'),
    branchId: z.string().uuid('Invalid branch ID'),
    teacherId: z.string().uuid().optional(),
});

// Subject validation schemas
export const createSubjectSchema = z.object({
    name: z.string().min(1, 'Subject name is required'),
    classId: z.string().uuid('Invalid class ID'),
    teacherId: z.string().uuid().optional(),
});

// Attendance validation schemas
export const createAttendanceSchema = z.object({
    studentId: z.string().uuid('Invalid student ID'),
    date: z.string().or(z.date()),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    remarks: z.string().optional(),
});

// Exam validation schemas
export const createExamSchema = z.object({
    name: z.string().min(1, 'Exam name is required'),
    date: z.string().or(z.date()),
    subjectId: z.string().uuid('Invalid subject ID'),
    weightage: z.number().min(0).max(100).default(100),
});

// Mark validation schemas
export const createMarkSchema = z.object({
    studentId: z.string().uuid('Invalid student ID'),
    examId: z.string().uuid('Invalid exam ID'),
    score: z.number().min(0),
    remarks: z.string().optional(),
});

// Assignment validation schemas
export const createAssignmentSchema = z.object({
    title: z.string().min(1, 'Assignment title is required'),
    description: z.string().optional(),
    dueDate: z.string().or(z.date()),
    subjectId: z.string().uuid('Invalid subject ID'),
    teacherId: z.string().uuid('Invalid teacher ID'),
    fileUrl: z.string().url().optional(),
});

// Fee validation schemas
export const createFeeStatusSchema = z.object({
    studentId: z.string().uuid('Invalid student ID'),
    title: z.string().min(1, 'Fee title is required'),
    amount: z.number().min(0),
    paid: z.number().min(0).default(0),
    status: z.enum(['PAID', 'UNPAID', 'PARTIAL']),
    dueDate: z.string().or(z.date()),
});

// Announcement validation schemas
export const createAnnouncementSchema = z.object({
    title: z.string().min(1, 'Announcement title is required'),
    content: z.string().min(1, 'Announcement content is required'),
    branchId: z.string().uuid().optional(),
    target: z.enum(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type CreateMarkInput = z.infer<typeof createMarkSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type CreateFeeStatusInput = z.infer<typeof createFeeStatusSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
