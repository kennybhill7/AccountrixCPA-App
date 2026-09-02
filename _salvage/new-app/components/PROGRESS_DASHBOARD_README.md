# Enhanced Progress Dashboard

A comprehensive, feature-rich progress tracking dashboard for the Accountrix education platform, built with React, TypeScript, Recharts, and Zustand.

## Features

### 1. Dashboard Overview
- **Overall Progress Card**: Displays course completion percentage, weeks completed, level, XP, study streak, and hearts
- **Competency Radar Chart**: Visual representation of 10 core accounting competencies
- **Topic Mastery**: Progress bars showing mastery level for each major topic area
- **Recent Activity Feed**: Timeline of completed lessons, quizzes, badges, and exports
- **Recommended Next Steps**: AI-powered recommendations for what to study next

### 2. View Modes

#### Overview Mode
- High-level summary with key metrics
- Competency radar and topic mastery
- Recent activity and recommendations

#### Detailed Mode
- 10 comprehensive statistics cards (XP, lessons, quizzes, etc.)
- Goal progress tracking (daily, weekly, monthly)
- Certificate requirements and eligibility
- Weak areas analysis with recommendations
- Badges showcase (unlocked and locked)

#### Charts Mode
- XP Growth Over Time (line chart)
- Quiz Scores Trend (line chart)
- Time Spent Per Topic (bar chart)
- Competency Radar (repeated for focus)

#### Timeline Mode
- Achievement milestone timeline
- Complete activity history
- Visual chronological display

### 3. Core Competencies

The dashboard tracks 10 accounting competencies:

1. **Journal Entries** - DR/CR mastery
2. **Trial Balance** - Balance & adjustments
3. **Bank Reconciliation** - Reconciling accounts
4. **WIP Calculations** - Revenue recognition
5. **Chart of Accounts** - COA design
6. **Financial Statements** - P&L, BS, Cash Flow
7. **Job Costing** - Cost allocation
8. **Consolidations** - Multi-entity
9. **Payroll & Tax** - Compliance
10. **Month-End Close** - Closing procedures

### 4. Topic Mastery Areas

- Construction CFO
- COA & Statements
- Job Costing
- Multi-Entity
- Payroll & Tax
- Advanced Topics

### 5. Gamification Elements

#### XP System
- Earn XP for completing lessons (50 XP)
- Earn XP for passing quizzes (50-100 XP based on score)
- Earn XP for practice tasks (30 XP)
- Earn XP for exporting documents (10 XP)
- Earn XP for unlocking badges (200 XP)

#### Levels
- Level up every 200 XP
- Visual level display with progress

#### Hearts System
- 5 maximum hearts
- Lose hearts for incorrect quiz answers
- Restore hearts by practicing

#### Streaks
- Track consecutive study days
- Visual flame icon
- Earn badges for milestone streaks

#### Badges
- 40+ badges to unlock
- Examples:
  - Journal Master (100 journal entries)
  - Bank Rec Expert (50 bank reconciliations)
  - Quiz Master (90%+ on 10 quizzes)
  - 7-Day Streak
  - WIP Wizard
  - Consolidation King

### 6. Performance Tracking

#### XP Over Time
- Line chart showing XP growth over last 30 days
- Daily gain tracking
- Trend analysis

#### Quiz Scores Trend
- Line chart showing improvement over time
- Per-quiz score tracking
- Topic-specific performance

#### Time Spent
- Horizontal bar chart
- Hours spent per topic
- Total study time tracking

### 7. Weak Areas Analysis

Automatically identifies topics where:
- Average score < 75%
- Multiple failed attempts
- Not practiced recently

Provides actionable recommendations:
- "Review Week X lesson"
- "Practice Y scenario"
- "Watch tutorial video"

### 8. Goal System

Three types of goals:
- **Daily**: Earn 100 XP, Complete 1 lesson
- **Weekly**: Complete 4 lessons, Pass 2 quizzes
- **Monthly**: Complete 1 full month, Unlock 5 badges

### 9. Certificate Requirements

Track eligibility for Accountrix Certificate:
- Complete all 24 weeks
- Average quiz score 80%+
- Pass CPA Final Exam (80%+)
- Complete 20 case studies
- Complete 3 month-end closes

### 10. Statistics Cards

10 key metrics displayed:
- Total XP
- Lessons Completed
- Quizzes Passed
- Practice Tasks
- Documents Exported
- Average Quiz Score
- Study Streak
- Badges Unlocked (X/40)
- Hours Studied
- Completion %

## Technical Architecture

### File Structure

```
components/
├── EnhancedProgressDashboard.tsx  # Main dashboard component (all-in-one)
lib/
├── store/
│   └── userProgressStore.ts      # Zustand store for user progress
app/
├── dashboard/
│   └── page.tsx                  # Dashboard route page
```

### State Management (Zustand)

The `userProgressStore` manages all user progress data:

```typescript
interface UserProgressState {
  // Stats
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  // ... more stats

  // Data
  competencies: Competency[];
  topicMastery: TopicMastery[];
  activities: Activity[];
  badges: Badge[];
  goals: Goal[];
  // ... more data

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, topic: string) => void;
  completeQuiz: (quizName: string, score: number, topic: string) => void;
  // ... more actions
}
```

### Data Persistence

- Uses Zustand's `persist` middleware
- Stores data in localStorage
- Automatically syncs across tabs
- Survives page refreshes

### Charts Library

Using **Recharts** for all visualizations:
- RadarChart for competencies
- LineChart for XP and quiz trends
- BarChart for time spent
- Responsive and animated

## Usage

### Basic Setup

```tsx
import EnhancedProgressDashboard from '@/components/EnhancedProgressDashboard';

export default function DashboardPage() {
  return <EnhancedProgressDashboard />;
}
```

### Accessing the Store

```tsx
import { useUserProgressStore } from '@/lib/store/userProgressStore';

function MyComponent() {
  const { xp, level, addXP, completeLesson } = useUserProgressStore();

  const handleLessonComplete = () => {
    completeLesson('lesson-id', 'Topic Name');
  };

  return (
    <div>
      <p>Level {level} - {xp} XP</p>
      <button onClick={handleLessonComplete}>Complete Lesson</button>
    </div>
  );
}
```

### Updating Competencies

```tsx
const updateComp = useUserProgressStore(state => state.updateCompetency);

// Update a competency score
updateComp('Journal Entries', 90);
```

### Unlocking Badges

```tsx
const unlockBadge = useUserProgressStore(state => state.unlockBadge);

// Check if user meets criteria, then unlock
if (userCompletedCriteria) {
  unlockBadge('journal-master');
}
```

### Adding Custom Activities

```tsx
const addActivity = useUserProgressStore(state => state.addActivity);

addActivity({
  type: 'practice',
  action: 'Completed Custom Exercise',
  details: 'Advanced WIP Calculations',
  icon: '💪',
  color: 'purple'
});
```

## Customization

### Adding New Competencies

Edit `INITIAL_COMPETENCIES` in `userProgressStore.ts`:

```typescript
const INITIAL_COMPETENCIES: Competency[] = [
  {
    name: 'Your New Competency',
    score: 0,
    color: '#ff6b6b',
    description: 'Description here'
  },
  // ... more
];
```

### Adding New Badges

Edit `INITIAL_BADGES` in `userProgressStore.ts`:

```typescript
const INITIAL_BADGES: Badge[] = [
  {
    id: 'custom-badge',
    name: 'Custom Badge Name',
    description: 'Complete custom action',
    icon: '🎯',
    unlockedAt: null,
    criteria: 'Complete X tasks'
  },
  // ... more
];
```

### Customizing Colors

The dashboard uses Tailwind CSS. Key color schemes:
- Primary: Blue (bg-blue-500, text-blue-600)
- Success: Green (bg-green-500, text-green-600)
- Warning: Yellow (bg-yellow-500, text-yellow-600)
- Danger: Red (bg-red-500, text-red-600)
- Secondary: Purple (bg-purple-500, text-purple-600)

### Adding New View Modes

1. Add new type to `ViewMode`:
```typescript
type ViewMode = 'overview' | 'detailed' | 'charts' | 'timeline' | 'custom';
```

2. Add button in `DashboardHeader`:
```tsx
<Button onClick={() => setViewMode('custom')}>Custom View</Button>
```

3. Add conditional render in main component:
```tsx
{viewMode === 'custom' && <CustomMode />}
```

## API Integration

To integrate with a backend API:

```typescript
// In userProgressStore.ts, add API calls

const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set, get) => ({
      // ... existing code

      completeLesson: async (lessonId, topic) => {
        // Update local state immediately
        set((state) => ({
          lessonsCompleted: state.lessonsCompleted + 1,
          xp: state.xp + 50
        }));

        // Sync with backend
        try {
          await fetch('/api/progress/lesson', {
            method: 'POST',
            body: JSON.stringify({ lessonId, topic })
          });
        } catch (error) {
          console.error('Failed to sync:', error);
        }
      }
    }),
    { name: 'user-progress-storage' }
  )
);
```

## Performance Considerations

### Memoization

The dashboard uses React's `useMemo` for expensive calculations:

```typescript
const masteryPercent = useMemo(() => {
  return calculateMasteryPercent(topicMastery);
}, [topicMastery]);
```

### Lazy Loading

For large activity feeds, implement pagination:

```typescript
const [page, setPage] = useState(1);
const displayActivities = activities.slice(0, page * 10);
```

### Chart Optimization

Recharts handles virtualization automatically, but limit data points:

```typescript
const chartData = xpHistory.slice(-30); // Only show last 30 days
```

## Accessibility

The dashboard follows WCAG 2.1 AA guidelines:
- Semantic HTML elements
- Proper heading hierarchy
- Keyboard navigation support
- Color contrast ratios > 4.5:1
- ARIA labels on interactive elements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

```json
{
  "react": "^19.1.1",
  "recharts": "^3.2.1",
  "zustand": "^5.0.8",
  "lucide-react": "^0.542.0",
  "tailwindcss": "^4.1.13"
}
```

## Future Enhancements

Potential features to add:
- Export dashboard as PDF
- Share progress on social media
- Compare with other students
- AI-powered study recommendations
- Mobile app version
- Real-time collaboration
- Leaderboards
- Custom themes
- Dark mode
- Animated transitions
- Sound effects
- Push notifications

## Troubleshooting

### Charts not rendering
- Ensure Recharts is installed: `npm install recharts`
- Check that parent container has defined dimensions
- Verify data format matches Recharts requirements

### Store not persisting
- Check localStorage is enabled in browser
- Verify Zustand persist middleware is configured
- Clear localStorage and reload: `localStorage.clear()`

### Performance issues
- Reduce number of activities displayed
- Implement pagination for large datasets
- Use React.memo for expensive components
- Profile with React DevTools

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- GitHub Issues: [repository]/issues
- Email: support@accountrix.com
- Documentation: https://docs.accountrix.com

---

Built with ❤️ by the Accountrix Team
