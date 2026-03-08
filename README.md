# FLI Green Skills Academy - LMS Platform

A full-stack Learning Management System built for the **FLI Green Skills Academy**.  
The platform delivers structured climate leadership and green skills education through interactive modules, quizzes, flip cards, reflections, and project-based learning.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

---

## Features

### Learning Experience

- **3 Modules, 12 Units**: A structured curriculum that explores the global metacrisis, green economics, and climate innovation
- **Interactive Flip Cards**: 3D animated cards used to explain key concepts and definitions
- **Quizzes with Scoring**: Multiple-choice assessments with a 60% passing score and instant feedback
- **Reflection Prompts**: Guided journaling with responses saved for each unit
- **YouTube Video Embeds**: Video lessons embedded directly inside each unit
- **Progress Tracking**: Track completion per unit with a progress dashboard
- **Milestone Project**: System Mapping Challenge with text-based submissions

### Platform

- **Role-Based Access**: Separate roles for Students and Admins
- **Admin Dashboard**: View platform statistics, manage users, and review submissions
- **Responsive Sidebar Navigation**: Collapsible sidebar that works on desktop and mobile
- **Server-Side Rendering**: Built with the Next.js App Router and server components for fast page loads
- **Secure Authentication**: Email and password authentication using bcrypt hashing and JWT sessions

---

## Tech Stack

| Layer | Technology |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 6 |
| Authentication | NextAuth.js 4 (Credentials Provider) |
| Icons | Lucide React |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
lms-app/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed script (3 modules, 12 units, quizzes)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home (redirect)
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── (authenticated)/   # Protected routes
│   │   │   ├── dashboard/     # Progress overview
│   │   │   ├── modules/       # Module listing and details
│   │   │   ├── units/         # Unit lesson pages
│   │   │   ├── project/       # Milestone project submission
│   │   │   ├── profile/       # User profile
│   │   │   └── admin/         # Admin dashboard
│   │   └── api/               # API routes
│   │       ├── auth/          # Signup and NextAuth
│   │       ├── modules/       # Module endpoints
│   │       ├── units/         # Unit endpoints
│   │       ├── progress/      # Progress tracking
│   │       ├── reflection/    # Reflection storage
│   │       ├── quiz/          # Quiz submission
│   │       ├── submission/    # Project submissions
│   │       └── admin/         # Admin statistics
│   ├── components/
│   │   ├── ui/                # Button, Card, Badge, Input, Progress, Textarea
│   │   ├── lesson/            # FlipCard, QuizSection, Reflection, VideoEmbed
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   └── session-provider.tsx
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client
│   │   └── utils.ts           # cn() utility
│   ├── types/
│   │   └── next-auth.d.ts     # Session type extensions
│   └── middleware.ts          # Route protection
```

---

## Database Schema

```
User -------- Progress (userId + unitId unique)
  │                │
  ├── Reflection --┤
  │                │
  └── Submission   Unit -- FlipCard
                    │
             Module ── QuizQuestion
```

**Models:** User, Module, Unit, FlipCard, QuizQuestion, Reflection, Progress, Submission

---

## API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| * | `/api/auth/[...nextauth]` | NextAuth handler |
| GET | `/api/modules` | List modules with units |
| GET | `/api/modules/[id]` | Module details |
| GET | `/api/units/[id]` | Unit with flip cards and quiz |
| POST/GET | `/api/progress` | Mark unit complete or fetch progress |
| POST/GET | `/api/reflection` | Save or fetch reflections |
| POST | `/api/quiz/submit` | Submit quiz (60% passing score) |
| POST/GET | `/api/submission` | Create or fetch project submissions |
| GET | `/api/admin/stats` | Platform statistics for admin |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (the free tier works fine)

### Installation

```bash
# Clone the repository
git clone https://github.com/Coder-mania/LMS-Platform.git
cd LMS-Platform/lms-app

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file inside `lms-app/`.

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Push schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed the database with course content
npx prisma db seed
```

### Run the Project

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### Default Accounts

| Role | Email | Password |
|-----|------|----------|
| Admin | admin@fli.org | admin123 |
| Student | student@fli.org | student123 |

---

## Course Content

### Module 1: Understanding the Global Metacrisis

- Unit 1.1: The Metacrisis: Why Everything Feels Connected
- Unit 1.2: Living in a VUCA World
- Unit 1.3: Planetary Boundaries
- Unit 1.4: Environmental Awakening: A Timeline

### Module 2: Rethinking the Economy

- Unit 2.1: From Industrial Economy to Green Economy
- Unit 2.2: Doughnut Economics
- Unit 2.3: Circular Economy
- Unit 2.4: Regenerative Economy

### Module 3: Climate Solutions and Green Innovation

- Unit 3.1: The Energy Transition
- Unit 3.2: Renewable Energy Revolution
- Unit 3.3: Climate Tech Startups
- Unit 3.4: Climate Entrepreneurship

---

## License

This project was developed for the **FLI Green Skills Academy**.
