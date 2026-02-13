# 🏫 School LMS - Learning Management System

A modern, scalable, multi-branch School Learning Management System built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)

## ✨ Features

### 🌐 Public Website
- Modern landing page with school information
- About Us, Admissions, Contact pages
- Branch locations and information
- News & Announcements
- Role-based login portal

### 👥 Multi-Role Support
- **Super Admin**: Global system management
- **Branch Admin**: Branch-level operations
- **Teacher**: Class management and grading
- **Student**: Learning dashboard and resources
- **Parent**: Child monitoring and communication

### 📚 Core Modules
- ✅ Student Records Management
- ✅ Attendance Tracking with SMS Alerts
- ✅ Academic Management (Classes, Subjects, Sections)
- ✅ Assessment & Exam System
- ✅ Assignment Management
- ✅ Fee Status Tracking
- ✅ Communication System
- ✅ Analytics & Reporting
- ✅ Document Management

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand / Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lms-Dashboard-Project
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/school_lms"

# Authentication (for future implementation)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# SMS Configuration (for attendance alerts)
SMS_API_KEY="your-sms-api-key"
SMS_SENDER_ID="SCHOOL"

# Email Configuration
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-password"
EMAIL_FROM="noreply@schoollms.com"

# App Configuration
APP_NAME="School LMS"
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
lms-Dashboard-Project/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/          # Admin dashboard layouts
│   │   │   ├── dashboard/
│   │   │   │   ├── super-admin/
│   │   │   │   ├── branch-admin/
│   │   │   │   ├── teacher/
│   │   │   │   └── student/
│   │   │   └── layout.tsx
│   │   ├── (full-width-pages)/
│   │   │   └── (auth)/
│   │   │       └── login/
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx
│   ├── components/           # Reusable components
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts       # Prisma client
│   │   ├── utils.ts        # Helper functions
│   │   ├── validations.ts  # Zod schemas
│   │   └── config.ts       # Environment config
│   ├── services/           # API service layer
│   ├── types/              # TypeScript types
│   └── middleware/         # Next.js middleware
├── public/                 # Static assets
└── package.json
```

## 👤 User Roles

### Super Admin
- Manage all branches
- Create/Edit/Delete branches
- Assign branch admins
- View global analytics
- System configuration

### Branch Admin
- Manage students and teachers
- Approve admissions
- Manage attendance and fees
- Schedule exams
- Generate reports

### Teacher
- View assigned classes
- Take daily attendance
- Add marks & assessments
- Upload study materials
- Communicate with parents

### Student
- View dashboard
- Check attendance records
- View marks & results
- Submit assignments
- Access study materials

### Parent
- View child's attendance
- Receive SMS alerts
- View performance reports
- Communicate with teachers

## 🗄 Database Schema

Key entities:
- User, Role, Branch
- Student, Teacher, Parent
- Class, Section, Subject
- Enrollment, Attendance
- Exam, Mark, Assignment
- Fee Status, Announcement
- Message, Timetable
- Academic Year, Audit Log

See `prisma/schema.prisma` for complete schema.

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev    # Create migration
npx prisma db push   # Push schema changes
npx prisma generate  # Generate Prisma Client
```

### Demo Credentials

For testing purposes:
- **Student**: student@demo.com / password
- **Teacher**: teacher@demo.com / password
- **Branch Admin**: admin@demo.com / password
- **Super Admin**: superadmin@demo.com / password

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- Render

## 📝 TODO / Roadmap

- [ ] Implement NextAuth authentication
- [ ] Add SMS integration for attendance alerts
- [ ] Implement email notifications
- [ ] Add file upload for assignments
- [ ] Create PDF report card generation
- [ ] Add real-time notifications
- [ ] Implement role-based middleware
- [ ] Add data export (CSV/PDF)
- [ ] Create mobile-responsive timetable
- [ ] Add parent dashboard
- [ ] Implement search functionality
- [ ] Add data visualization charts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@schoollms.com or create an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
