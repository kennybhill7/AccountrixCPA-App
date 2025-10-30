# Accountrix - Complete Build Specification for Lovable

**Project:** Accountrix - Construction CFO Training Platform
**Status:** Ready for Implementation
**Date:** 2025-10-30
**Tech Stack:** Next.js 14+, React, TypeScript, Tailwind CSS

---

## 🎯 Executive Summary

Accountrix is a comprehensive 12-month online training platform for construction CFOs. The application provides structured learning modules, interactive quizzes, flashcards, and practice exercises for mastering construction accounting and financial management.

**Current Status:**
- ✅ All 12 months of curriculum content complete (305,663 words)
- ✅ 705 quiz questions with explanations
- ✅ 480 flashcards
- ✅ All data validated and production-ready
- ✅ Core components partially built
- ⚠️ Need: Complete UI implementation, user authentication, progress tracking

---

## 📊 Application Architecture

### Tech Stack
```
Frontend Framework: Next.js 14+ (App Router)
UI Library: React 18+
Styling: Tailwind CSS
UI Components: shadcn/ui (Radix UI primitives)
Language: TypeScript
State Management: React Context / Zustand (recommended)
Authentication: NextAuth.js / Supabase Auth (recommended)
Database: Supabase / Firebase (for user progress)
Deployment: Vercel
```

### Project Structure
```
accountrix/
├── app/                          # Next.js 14 app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── dashboard/               # User dashboard
│   ├── curriculum/              # Curriculum pages
│   │   ├── month/[id]/         # Month overview
│   │   └── week/[id]/          # Week lesson page
│   ├── quiz/[id]/              # Quiz pages
│   ├── flashcards/[id]/        # Flashcard study pages
│   ├── practice/               # Practice exercises
│   │   ├── bank-reconciliation/
│   │   └── journal-entries/
│   └── api/                    # API routes
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── curriculum/             # Curriculum-specific components
│   ├── quiz/                   # Quiz components
│   └── practice/               # Practice exercise components
├── lib/                        # Utility functions
│   ├── curriculum.ts           # Curriculum data loading
│   ├── achievements.ts         # Achievement system
│   └── progress.ts            # Progress tracking
├── data/                       # Static curriculum data
│   ├── m1.json - m12.json     # Month data files (COMPLETE)
│   └── curriculum.json         # Curriculum index
├── types/                      # TypeScript definitions
└── public/                     # Static assets
```

---

## 📚 Data Schema

### 1. Curriculum Data Structure (JSON Files)

**Location:** `data/m[1-12].json`

#### Month Structure
```typescript
interface Month {
  id: string;                    // "m1", "m2", etc.
  title: string;                 // "Month 1: Construction CFO Fundamentals"
  description: string;           // Month description
  weeks: Week[];                 // Array of 4 weeks
}

interface Week {
  id: string;                    // "w1", "w2", "w3", "w4"
  order: number;                 // 1, 2, 3, 4
  title: string;                 // "Week 1: Core Concepts"
  lessonHtml: string;            // Full HTML content of lesson (5,000-16,000 words)

  // Quiz format varies by month:
  // Months 1-5: Nested format
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  // Months 6-12: Direct array
  quiz: QuizQuestion[];

  flashcards: Flashcard[];       // Array of 10 flashcards per week
}

interface QuizQuestion {
  id: string;                    // "q1", "q2", etc.
  question: string;              // Question text
  options: string[];             // Array of 4 options
  correctAnswer: number;         // Index of correct answer (0-3)
  explanation: string;           // Detailed explanation of answer
}

interface Flashcard {
  id: string;                    // "f1", "f2", etc.
  question: string;              // Front of card
  answer: string;                // Back of card
}
```

#### Example Month File Structure
```json
{
  "id": "m1",
  "title": "Month 1: Construction CFO Fundamentals",
  "description": "Master the foundational concepts...",
  "weeks": [
    {
      "id": "w1",
      "order": 1,
      "title": "Week 1: Core Concepts",
      "lessonHtml": "<h1>Week 1...</h1>...",
      "quiz": {
        "id": "m1-w1-quiz",
        "title": "Week 1 Quiz",
        "questions": [
          {
            "id": "q1",
            "question": "What is job costing?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Job costing is..."
          }
        ]
      },
      "flashcards": [
        {
          "id": "f1",
          "question": "What is WIP?",
          "answer": "Work in Progress represents..."
        }
      ]
    }
  ]
}
```

**IMPORTANT:** Months 1-5 use nested quiz structure (`quiz.questions`), Months 6-12 use direct array (`quiz`). Your code must handle both formats.

### 2. User Progress Data Structure (Database)

```typescript
interface UserProfile {
  id: string;                    // User ID
  email: string;
  name: string;
  createdAt: Date;
  currentMonth: number;          // 1-12
  currentWeek: number;           // 1-4
  completedWeeks: string[];      // ["m1-w1", "m1-w2", ...]
  achievements: string[];        // Achievement IDs earned
  totalPoints: number;
  streak: number;                // Current day streak
  lastAccessDate: Date;
}

interface WeekProgress {
  userId: string;
  weekId: string;                // "m1-w1", etc.
  lessonCompleted: boolean;
  quizAttempts: QuizAttempt[];
  flashcardsStudied: boolean;
  completedAt?: Date;
}

interface QuizAttempt {
  attemptId: string;
  weekId: string;
  userId: string;
  score: number;                 // 0-100
  totalQuestions: number;
  correctAnswers: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  completedAt: Date;
  timeSpent: number;             // Seconds
}

interface FlashcardProgress {
  userId: string;
  weekId: string;
  flashcardId: string;
  confidence: 'learning' | 'reviewing' | 'mastered';
  lastReviewed: Date;
  timesReviewed: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'quiz' | 'practice' | 'streak' | 'special';
  requirement: string;
  points: number;
  earnedBy: string[];            // User IDs
}
```

---

## 🎨 Core Features to Build

### 1. **Authentication & User Management**

**Pages:**
- `/login` - Login page
- `/signup` - Registration page
- `/profile` - User profile and settings

**Features:**
- Email/password authentication
- OAuth (Google, optional)
- Password reset
- Profile picture upload (optional)
- Account settings

**State:**
- Current user session
- User profile data
- Progress statistics

### 2. **Dashboard** (`/dashboard`)

**Components to Build:**
- Welcome header with user name
- Progress overview card:
  - Current month/week indicator
  - Overall completion percentage
  - Total quiz scores average
  - Study streak counter
- Quick action buttons:
  - Continue Learning (go to current week)
  - Take Quiz
  - Study Flashcards
- Recent achievements display
- Learning statistics charts (optional):
  - Quiz performance over time
  - Time spent learning
  - Topics mastered

**Data Sources:**
- User profile from database
- Progress data from database
- Curriculum data from JSON files

### 3. **Curriculum Navigator** (`/curriculum`)

**Pages:**
- `/curriculum` - Overview of all 12 months
- `/curriculum/month/[id]` - Individual month overview (4 weeks)
- `/curriculum/week/[id]` - Individual week lesson page

**Month Overview Page Features:**
- Month title and description
- 4 week cards showing:
  - Week title
  - Completion status (icon/badge)
  - Quiz score if taken
  - "Start" or "Continue" button
- Lock/unlock logic: Users must complete weeks sequentially

**Week Lesson Page Features:**
- Breadcrumb navigation (Home > Curriculum > Month X > Week Y)
- Lesson content rendered from `lessonHtml` field
- Styled HTML rendering with proper typography
- Reading progress indicator (scroll position)
- Bottom navigation:
  - "Previous Week" button
  - "Mark as Complete" button
  - "Next Week" / "Take Quiz" button
- Sidebar (optional):
  - Table of contents from HTML headings
  - Progress indicator
  - Week navigation

**HTML Rendering:**
The `lessonHtml` field contains pre-formatted HTML with:
- `<h1>`, `<h2>`, `<h3>` headings
- `<p>` paragraphs
- `<ul>`, `<ol>`, `<li>` lists
- `<div class="cfo-insight">` special callout boxes
- `<pre><code>` formula blocks
- `<strong>`, `<em>` text formatting

Apply Tailwind styles for proper rendering:
```tsx
<div
  className="prose prose-slate max-w-none
    prose-headings:font-bold prose-headings:text-slate-900
    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
    prose-p:text-slate-700 prose-p:leading-relaxed
    prose-li:text-slate-700
    prose-strong:text-slate-900 prose-strong:font-semibold
    prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
    prose-pre:bg-slate-800 prose-pre:text-slate-100"
  dangerouslySetInnerHTML={{ __html: week.lessonHtml }}
/>
```

### 4. **Quiz System** (`/quiz/[weekId]`)

**Quiz Taking Interface:**
- Question counter (e.g., "Question 3 of 15")
- Question text display
- 4 multiple choice options as clickable cards
- "Submit Answer" button (disabled until option selected)
- Timer (optional)
- Progress bar

**After Submission:**
- Show if answer correct/incorrect immediately
- Display explanation
- "Next Question" button
- Update progress counter

**Quiz Results Page:**
- Score display (percentage and fraction)
- Time taken
- Question-by-question breakdown:
  - Question text
  - Your answer
  - Correct answer
  - Explanation
  - Color coding (green/red)
- "Retake Quiz" button
- "Continue to Next Week" button
- Save results to database

**Data Handling:**
```typescript
// Load quiz questions
const getWeekQuiz = (monthId: string, weekId: string) => {
  const month = loadMonthData(monthId);
  const week = month.weeks.find(w => w.id === weekId);

  // Handle both quiz formats
  if (Array.isArray(week.quiz)) {
    return week.quiz; // Months 6-12
  } else {
    return week.quiz.questions; // Months 1-5
  }
};

// Save quiz attempt
const saveQuizAttempt = async (attempt: QuizAttempt) => {
  // Save to database
  // Update user progress
  // Check for achievements (perfect score, etc.)
};
```

### 5. **Flashcard System** (`/flashcards/[weekId]`)

**Study Interface:**
- Card display with flip animation
- Front shows question
- Click/tap to flip to answer
- Confidence rating buttons:
  - "Learning" (red) - See again soon
  - "Reviewing" (yellow) - See again later
  - "Mastered" (green) - Know it well
- Card counter (e.g., "Card 3 of 10")
- Progress bar
- Shuffle option
- Restart button

**Spaced Repetition (Optional Advanced Feature):**
- Track last review date
- Calculate next review date based on confidence
- Show "due for review" count on dashboard

**Features:**
- Keyboard shortcuts (Space to flip, 1/2/3 for confidence)
- Swipe gestures on mobile
- Auto-advance after confidence selection
- Session complete screen:
  - Cards reviewed count
  - Confidence distribution chart
  - "Study Again" button

### 6. **Practice Exercises** (`/practice`)

**Bank Reconciliation Worksheet** (ALREADY BUILT)
- Location: `components/BankReconciliationWorksheet.tsx`
- Status: ✅ Complete, ready to integrate
- Just needs routing: `/practice/bank-reconciliation`

**Journal Entry Simulator** (Check if exists)
- Practice creating journal entries
- Scenario-based exercises
- Automatic validation

**To Integrate:**
```tsx
// app/practice/bank-reconciliation/page.tsx
import BankReconciliationWorksheet from '@/components/BankReconciliationWorksheet';

export default function BankReconciliationPage() {
  return (
    <div className="container mx-auto py-8">
      <BankReconciliationWorksheet />
    </div>
  );
}
```

### 7. **Achievement System**

**Achievement Types:**
- First Week Completed
- First Quiz Perfect Score
- Complete a Month
- 7-Day Streak
- 30-Day Streak
- Quiz Master (90%+ average)
- Speed Learner (complete week in one session)
- Flashcard Champion (master all cards in a month)
- Half-Way Hero (complete 6 months)
- CFO Graduate (complete all 12 months)

**UI Components:**
- Achievement notification toast/modal when earned
- Achievements page showing all available achievements
- Progress bars for incremental achievements
- Badge display on profile
- Points system

**Data Structure:**
See `lib/achievements.ts` (check if exists, or create)

### 8. **Progress Tracking**

**Database Schema Requirements:**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  current_month INTEGER DEFAULT 1,
  current_week INTEGER DEFAULT 1,
  total_points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_access_date DATE
);

-- Week progress table
CREATE TABLE week_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week_id TEXT NOT NULL, -- "m1-w1"
  lesson_completed BOOLEAN DEFAULT FALSE,
  quiz_best_score INTEGER,
  flashcards_studied BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  UNIQUE(user_id, week_id)
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB, -- Store question-by-question results
  completed_at TIMESTAMP DEFAULT NOW(),
  time_spent INTEGER -- seconds
);

-- Flashcard progress table
CREATE TABLE flashcard_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  week_id TEXT NOT NULL,
  flashcard_id TEXT NOT NULL,
  confidence TEXT CHECK (confidence IN ('learning', 'reviewing', 'mastered')),
  last_reviewed TIMESTAMP,
  times_reviewed INTEGER DEFAULT 0,
  UNIQUE(user_id, week_id, flashcard_id)
);

-- Achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

---

## 🎨 UI/UX Design Guidelines

### Design System

**Colors:**
```css
Primary: #3b82f6 (blue-500) - Main brand color
Secondary: #8b5cf6 (violet-500) - Accents
Success: #10b981 (green-500) - Completed, correct answers
Warning: #f59e0b (amber-500) - In progress, reviewing
Error: #ef4444 (red-500) - Incorrect, needs attention
Neutral: #64748b (slate-500) - Text, borders

Backgrounds:
- Light: #ffffff (white)
- Muted: #f8fafc (slate-50)
- Dark: #1e293b (slate-800)
```

**Typography:**
```css
Font Family: Inter (from Tailwind)
Headings: font-bold, tracking-tight
Body: font-normal, leading-relaxed (1.75rem line height)
Code: font-mono
```

**Component Library:**
Use shadcn/ui components (already installed):
- Button
- Card
- Badge
- Dialog/Modal
- Select
- Checkbox
- Progress
- Toast
- Tabs
- Accordion

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar navigation collapses to hamburger menu on mobile
- Cards stack vertically on mobile
- Quiz interface optimized for mobile (large touch targets)

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Color contrast ratio 4.5:1 minimum
- Screen reader friendly

---

## 🔧 Implementation Priority

### Phase 1: Core MVP (Week 1-2)
1. ✅ Setup Next.js project structure
2. ✅ Install dependencies (shadcn/ui, Tailwind)
3. ⚠️ **Implement authentication** (NextAuth.js or Supabase)
4. ⚠️ **Build dashboard page**
5. ⚠️ **Build curriculum navigator** (month/week pages)
6. ⚠️ **Implement lesson reading page** with HTML rendering
7. ⚠️ **Basic progress tracking** (mark week as complete)

### Phase 2: Assessment Features (Week 2-3)
8. ⚠️ **Build quiz system**
   - Quiz taking interface
   - Answer submission
   - Results display
   - Progress saving
9. ⚠️ **Build flashcard system**
   - Card flip interface
   - Confidence tracking
   - Progress saving
10. ⚠️ **Integrate practice exercises**
    - Bank reconciliation (already built)
    - Journal entry simulator

### Phase 3: Gamification (Week 3-4)
11. ⚠️ **Implement achievement system**
12. ⚠️ **Add points and badges**
13. ⚠️ **Build streak tracking**
14. ⚠️ **Create achievements page**

### Phase 4: Polish & Deploy (Week 4)
15. ⚠️ **User profile page**
16. ⚠️ **Settings page**
17. ⚠️ **Responsive design refinement**
18. ⚠️ **Performance optimization**
19. ⚠️ **Testing**
20. ⚠️ **Deploy to Vercel**

---

## 📦 Data Loading Utilities

Create `lib/curriculum.ts`:

```typescript
import m1 from '@/data/m1.json';
import m2 from '@/data/m2.json';
import m3 from '@/data/m3.json';
import m4 from '@/data/m4.json';
import m5 from '@/data/m5.json';
import m6 from '@/data/m6.json';
import m7 from '@/data/m7.json';
import m8 from '@/data/m8.json';
import m9 from '@/data/m9.json';
import m10 from '@/data/m10.json';
import m11 from '@/data/m11.json';
import m12 from '@/data/m12.json';

const months = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12];

export function getAllMonths() {
  return months;
}

export function getMonth(monthId: string) {
  const monthNum = parseInt(monthId.replace('m', ''));
  return months[monthNum - 1];
}

export function getWeek(monthId: string, weekId: string) {
  const month = getMonth(monthId);
  return month.weeks.find(w => w.id === weekId);
}

export function getQuizQuestions(monthId: string, weekId: string) {
  const week = getWeek(monthId, weekId);
  if (!week) return [];

  // Handle both quiz formats
  if (Array.isArray(week.quiz)) {
    return week.quiz; // Months 6-12
  } else {
    return week.quiz.questions; // Months 1-5
  }
}

export function getFlashcards(monthId: string, weekId: string) {
  const week = getWeek(monthId, weekId);
  return week?.flashcards || [];
}

export function getCurriculumStats() {
  return {
    totalMonths: 12,
    totalWeeks: 48,
    totalQuizQuestions: 705,
    totalFlashcards: 480
  };
}
```

---

## 🚀 Quick Start Instructions for Lovable

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd accountrix
npm install
```

### Step 2: Setup Environment Variables
Create `.env.local`:
```env
# Database (Supabase recommended)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 3: Database Setup
Run SQL schema (see Progress Tracking section above) in Supabase dashboard

### Step 4: Verify Data Files
All curriculum data is in `data/m1.json` through `data/m12.json` - these are complete and ready to use.

### Step 5: Start Development
```bash
npm run dev
```

### Step 6: Build Features
Follow the implementation priority outlined above, starting with Phase 1.

---

## 📋 Key Technical Notes

### 1. Quiz Format Handling
**CRITICAL:** Months 1-5 use nested quiz structure, Months 6-12 use direct array. Always check the format:

```typescript
function getQuestions(week: Week) {
  if (Array.isArray(week.quiz)) {
    return week.quiz;
  }
  return week.quiz.questions;
}
```

### 2. HTML Content Rendering
Lesson HTML is pre-formatted. Use `dangerouslySetInnerHTML` with proper sanitization and Tailwind prose classes.

### 3. Progress Logic
- Users must complete weeks sequentially within a month
- Lock future weeks until current week is completed
- Week completion requires: lesson read + quiz passed (60%+) + flashcards studied
- Months can be accessed in order (complete month 1 before month 2)

### 4. Quiz Scoring
- Minimum passing score: 60%
- Track best score per week
- Allow unlimited retakes
- Store all attempts for analytics

### 5. Performance Optimization
- JSON files are large (m1.json is 316KB). Consider:
  - Dynamic imports for month data
  - Code splitting by route
  - Lazy loading lesson HTML
  - Image optimization (if adding images)

---

## 🎯 Success Metrics

**MVP Launch Criteria:**
- [ ] User can register/login
- [ ] User can navigate curriculum (all 12 months, 48 weeks)
- [ ] User can read lessons
- [ ] User can take quizzes and see results
- [ ] User can study flashcards
- [ ] Progress is saved and persists
- [ ] Mobile responsive
- [ ] Deployed to production

**Full Launch Criteria:**
- [ ] All MVP features complete
- [ ] Achievement system working
- [ ] Practice exercises integrated
- [ ] User profile and settings
- [ ] Performance optimized (< 3s load time)
- [ ] Accessibility audit passed
- [ ] Cross-browser tested

---

## 📞 Support & Resources

**Data Files:** All located in `data/` directory, validated and production-ready
**Existing Components:** Check `components/` for pre-built components
**Audit Report:** See `COMPREHENSIVE_AUDIT_REPORT.md` for data validation details

**Questions?** Check these files:
- `AUDIT_REPORT.json` - Detailed breakdown of all curriculum data
- `audit-all-months.js` - Script to validate data integrity
- `types/` - TypeScript type definitions (if exists)

---

## ✅ Ready for Implementation

All curriculum data is complete, validated, and ready for implementation. Start with Phase 1 and build iteratively. Focus on core learning experience first, then add gamification features.

**Next Steps:**
1. Review this specification
2. Setup authentication
3. Build dashboard
4. Implement curriculum navigator
5. Deploy MVP

Good luck! 🚀
