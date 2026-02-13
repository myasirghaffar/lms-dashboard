# 🛠️ Development Workflow Guide

## 🎯 Overview

This guide provides step-by-step instructions for implementing the remaining features of the School LMS system.

## 📋 Prerequisites Checklist

Before starting development, ensure:
- [ ] PostgreSQL is installed and running
- [ ] Node.js 18+ is installed
- [ ] Dependencies are installed (`npm install`)
- [ ] `.env` file is configured with database connection
- [ ] Prisma is set up (`npx prisma generate`)

## 🔄 Development Workflow

### 1. Setting Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Open Prisma Studio to view data
npx prisma studio
```

### 2. Creating API Routes

For each feature, create API routes in `src/app/api/`:

```typescript
// Example: src/app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createStudentSchema } from '@/lib/validations';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: { user: true, branch: true }
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createStudentSchema.parse(body);
    
    // Create user first
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: validated.password, // Hash this in production!
        name: validated.name,
        role: 'STUDENT',
        phoneNumber: validated.phoneNumber,
        address: validated.address,
      }
    });

    // Create student
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        branchId: validated.branchId,
        rollNumber: validated.rollNumber,
        parentId: validated.parentId,
      },
      include: { user: true }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
```

### 3. Creating Service Layer

Create reusable service functions in `src/services/`:

```typescript
// Example: src/services/studentService.ts
import { prisma } from '@/lib/prisma';
import { CreateStudentInput } from '@/lib/validations';

export class StudentService {
  static async getAllStudents(branchId?: string) {
    return await prisma.student.findMany({
      where: branchId ? { branchId } : undefined,
      include: {
        user: true,
        branch: true,
        parent: { include: { user: true } }
      }
    });
  }

  static async getStudentById(id: string) {
    return await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        branch: true,
        enrollments: { include: { section: true } },
        attendance: true,
        marks: { include: { exam: true } }
      }
    });
  }

  static async createStudent(data: CreateStudentInput) {
    // Implementation here
  }

  static async updateStudent(id: string, data: Partial<CreateStudentInput>) {
    // Implementation here
  }

  static async deleteStudent(id: string) {
    return await prisma.student.delete({ where: { id } });
  }
}
```

### 4. Creating Components

Build reusable components in `src/components/`:

```typescript
// Example: src/components/students/StudentTable.tsx
'use client';

import React from 'react';
import { Student } from '@/types';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">Roll Number</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Branch</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b dark:border-gray-700">
              <td className="px-6 py-4">{student.rollNumber}</td>
              <td className="px-6 py-4">{student.user?.name}</td>
              <td className="px-6 py-4">{student.user?.email}</td>
              <td className="px-6 py-4">{student.branch?.name}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onEdit(student)}>Edit</button>
                <button onClick={() => onDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 5. Implementing Features

Follow this order for best results:

#### Phase 1: Foundation (Week 1-2)
1. **Authentication**
   - Install and configure NextAuth
   - Create login/logout functionality
   - Implement role-based access control

2. **User Management**
   - Create user CRUD operations
   - Build user profile pages
   - Implement password management

#### Phase 2: Core Features (Week 3-4)
3. **Student Management**
   - Student list page
   - Add/Edit student forms
   - Student profile page
   - Bulk import functionality

4. **Teacher Management**
   - Teacher list page
   - Add/Edit teacher forms
   - Teacher profile page
   - Class assignment

5. **Branch Management**
   - Branch list page
   - Add/Edit branch forms
   - Branch statistics

#### Phase 3: Academic Features (Week 5-6)
6. **Class & Subject Management**
   - Class/Section CRUD
   - Subject assignment
   - Timetable creation

7. **Attendance System**
   - Daily attendance interface
   - Bulk attendance entry
   - Attendance reports
   - SMS alerts integration

8. **Assessment System**
   - Exam creation
   - Marks entry
   - Grade calculation
   - Result publishing

#### Phase 4: Additional Features (Week 7-8)
9. **Assignment System**
   - Assignment creation
   - File uploads
   - Submission tracking
   - Grading

10. **Fee Management**
    - Fee structure setup
    - Fee tracking
    - Payment recording
    - Reports

11. **Communication**
    - Announcements
    - Messaging
    - Notifications

## 🧪 Testing Strategy

### Unit Tests
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### Integration Tests
Test API routes and database operations

### E2E Tests
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## 📦 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] Security audit completed

### Deployment Steps
1. **Database Setup**
   ```bash
   # Production database
   npx prisma migrate deploy
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## 🔒 Security Best Practices

1. **Password Hashing**
   ```typescript
   import bcrypt from 'bcryptjs';
   
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate secrets regularly

3. **Input Validation**
   - Always validate with Zod
   - Sanitize user inputs
   - Use parameterized queries

4. **Authentication**
   - Implement CSRF protection
   - Use secure session cookies
   - Add rate limiting

## 📊 Performance Optimization

1. **Database**
   - Add indexes to frequently queried fields
   - Use database connection pooling
   - Implement caching (Redis)

2. **Frontend**
   - Use Next.js Image optimization
   - Implement lazy loading
   - Code splitting

3. **API**
   - Implement pagination
   - Use data compression
   - Add API rate limiting

## 🐛 Debugging Tips

1. **Prisma Studio**: Visual database browser
   ```bash
   npx prisma studio
   ```

2. **Next.js Dev Tools**: Built-in error overlay

3. **Database Logs**: Enable query logging
   ```typescript
   const prisma = new PrismaClient({
     log: ['query', 'info', 'warn', 'error'],
   });
   ```

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)

## 🤝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/student-management

# Make changes and commit
git add .
git commit -m "feat: add student CRUD operations"

# Push to remote
git push origin feature/student-management

# Create pull request
# After review, merge to main
```

## 📝 Commit Message Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

**Happy Coding! 🚀**
