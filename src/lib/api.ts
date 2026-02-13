
import users from '@/data/users.json';
import branches from '@/data/branches.json';
import students from '@/data/students.json';
import teachers from '@/data/teachers.json';
import classes from '@/data/classes.json';
import subjects from '@/data/subjects.json';
import attendance from '@/data/attendance.json';
import exams from '@/data/exams.json';
import marks from '@/data/marks.json';
import assignments from '@/data/assignments.json';
import fees from '@/data/fees.json';
import announcements from '@/data/announcements.json';
import { User, Branch, Student, Teacher, Class, Subject, Attendance, Exam, Mark, Assignment, FeeStatus, Announcement, DashboardStats } from '@/types';

// Mock API functions

export const getUsers = (): User[] => users as unknown as User[];
export const getBranches = (): Branch[] => branches as unknown as Branch[];
export const getStudents = (): Student[] => students as unknown as Student[];
export const getTeachers = (): Teacher[] => teachers as unknown as Teacher[];
export const getClasses = (): Class[] => classes as unknown as Class[];
export const getSubjects = (): Subject[] => subjects as unknown as Subject[];
export const getAttendance = (): Attendance[] => attendance as unknown as Attendance[];
export const getExams = (): Exam[] => exams as unknown as Exam[];
export const getMarks = (): Mark[] => marks as unknown as Mark[];
export const getAssignments = (): Assignment[] => assignments as unknown as Assignment[];
export const getFees = (): FeeStatus[] => fees as unknown as FeeStatus[];
export const getAnnouncements = (): Announcement[] => announcements as unknown as Announcement[];

export const getDashboardStats = (): DashboardStats => {
    return {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalBranches: branches.length,
        attendancePercentage: 92, // Mock calculation or derive from attendance data
        pendingFees: fees.reduce((acc, fee) => acc + (fee.amount - fee.paid), 0),
        upcomingExams: exams.filter(e => new Date(e.date) > new Date()).length
    };
};

// Helper to simulate network delay if needed
export const simulateDelay = async (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));
