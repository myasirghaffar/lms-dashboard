# 🏫 School LMS System

A comprehensive, multi-branch Learning Management System (LMS) built with Next.js, TypeScript, and Tailwind CSS. This system is designed to manage multiple school branches, automated attendance, academic records, fee tracking, and communication between stakeholders.

## 📌 Project Overview

This project converts a modern dashboard UI into a fully functional School LMS. It supports a public school website and a robust internal dashboard for different user roles.

### Key Features

*   **Public School Website**: Landing page, About Us, Admissions, Contact, News.
*   **Multi-Branch Architecture**: Scalable support for multiple school branches managed by a Super Admin.
*   **Role-Based Dashboards**: tailored interfaces for Super Admins, Branch Admins, Teachers, Students, and Parents.
*   **Academic Management**: Manage years, subjects, classes, sections, timetables, and grading.
*   **Attendance System**: Daily attendance tracking with SMS/Student alerts for absence.
*   **Assessment & Reports**: Exam creation, grading, and automated report card generation (PDF).
*   **Fees Management**: Track fee status (Paid/Unpaid/Partial) and generate fee reports.
*   **Communication**: Internal messaging, announcements, and email/SMS notifications.
*   **Document Management**: Upload and manage study materials, policies, and circulars.

## 🛠 Tech Stack

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) / Context API
*   **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
*   **Analytics**: [Recharts](https://recharts.org/)
*   **Design System**: [Outfit Font](https://fonts.google.com/specimen/Outfit)

## 🔐 User Roles

1.  **Super Admin**: Global control over all branches, settings, and comprehensive analytics.
2.  **Branch Admin**: Manages specific school branch operations (students, teachers, fees, schedule).
3.  **Teacher**: Manages classes, attendance, assignments, exams, and student progress.
4.  **Student**: Access to learning materials, assignments, results, timetable, and attendance records.
5.  **Parent**: Monitors child's attendance, academic performance, and fee status.

## 🚀 Getting Started

### Prerequisites

*   Node.js 18.x or later
*   PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/myasirghaffar/lms-dashboard.git
    cd lms-dashboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your database connection string and other secrets.
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"
    # Add other environment variables as needed (NEXTAUTH_SECRET, etc.)
    ```

4.  Run database migrations (after setting up Prisma schema):
    ```bash
    npx prisma migrate dev
    ```

5.  Start the development server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
/src
  /app          # Next.js App Router pages (Dashboard & Website)
  /components   # Reusable UI components
  /lib          # Utility functions and configurations
  /prisma       # Database schema and migrations
  /services     # API service layer
  /types        # TypeScript type definitions
  /utils        # Helper functions
```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
