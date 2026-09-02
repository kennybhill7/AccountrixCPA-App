# CPA Final Exam Simulator - Testing Guide

## Overview

This guide provides comprehensive testing procedures for the CPA Final Exam Simulator to ensure all functionality works correctly before deployment.

## Testing Environment Setup

### Prerequisites
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access the exam at
http://localhost:3000/exam
```

## Test Cases

### 1. Configuration Screen Tests

#### Test 1.1: Initial Load
- [ ] Configuration screen displays correctly
- [ ] All exam details visible (100 questions, 3 hours, 80% passing)
- [ ] Content coverage shows all 6 topics
- [ ] Both exam modes (Practice/Certification) are selectable
- [ ] Default mode is Certification
- [ ] Checkboxes for shuffle and timer are present

**Expected Result**: Clean, professional configuration UI with all information displayed.

#### Test 1.2: Mode Selection
- [ ] Click "Practice Mode" - button highlights, description updates
- [ ] Click "Certification Mode" - button highlights, description updates
- [ ] Mode selection persists when toggling checkboxes

**Expected Result**: Only one mode selected at a time, visual feedback clear.

#### Test 1.3: Configuration Options
- [ ] Toggle "Shuffle questions" checkbox on/off
- [ ] Toggle "Show timer" checkbox (only visible in Certification mode)
- [ ] Verify timer option hidden in Practice mode

**Expected Result**: Checkboxes toggle smoothly, timer option conditional on mode.

#### Test 1.4: Start Exam
- [ ] Click "Start Exam" button
- [ ] Questions load
- [ ] Configuration screen disappears
- [ ] Exam interface appears

**Expected Result**: Smooth transition to exam interface, no errors in console.

---

### 2. Question Display Tests

#### Test 2.1: Question Information
- [ ] Question number shows correctly (e.g., "Question 1 of 100")
- [ ] Difficulty badge displays (Easy/Medium/Hard/Expert)
- [ ] Points badge shows (1/2/3/5 points)
- [ ] Topic badge displays correctly
- [ ] Question text is readable and formatted

**Expected Result**: All question metadata displays correctly.

#### Test 2.2: Multiple Choice Questions
- [ ] Four options (A, B, C, D) display
- [ ] Click to select option
- [ ] Selected option highlights in blue
- [ ] Can change selection
- [ ] Only one option selectable at a time

**Expected Result**: Single-select radio button behavior, clear visual feedback.

#### Test 2.3: True/False Questions
- [ ] Two options (True/False) display
- [ ] Click to select
- [ ] Selected option highlights (green for True, red for False)
- [ ] Can change selection

**Expected Result**: Binary choice works correctly.

#### Test 2.4: Multiple Select Questions
- [ ] Multiple options display with checkboxes
- [ ] Can select multiple options
- [ ] Can deselect options
- [ ] Selected options highlight
- [ ] All selections persist

**Expected Result**: Multi-select checkbox behavior, can choose 0 to all options.

#### Test 2.5: Fill-in-the-Blank Questions
- [ ] Number input field displays
- [ ] Can type numeric values
- [ ] Negative numbers work
- [ ] Decimal numbers work
- [ ] Large numbers work (e.g., 1000000)
- [ ] Instructions display below input

**Expected Result**: Accepts all valid numeric inputs, clear instructions.

#### Test 2.6: Scenario-Based Questions
- [ ] Scenario box displays above question
- [ ] Scenario text is readable
- [ ] Question text displays after scenario
- [ ] Multiple choice options display
- [ ] Layout is clean and organized

**Expected Result**: Scenario clearly separated from question, easy to read.

---

### 3. Navigation Tests

#### Test 3.1: Basic Navigation
- [ ] "Previous" button disabled on question 1
- [ ] "Previous" button works on questions 2-100
- [ ] "Next" button works on questions 1-99
- [ ] "Next" button shows "Submit Exam" on question 100
- [ ] Navigation preserves answers

**Expected Result**: Smooth navigation, answers persist, correct button states.

#### Test 3.2: Question Grid Navigation
- [ ] Click "Show Question Grid" button
- [ ] 100 buttons display in 10×10 grid
- [ ] Click any button to jump to that question
- [ ] Current question has blue ring
- [ ] Grid updates when navigating
- [ ] Click "Hide Question Grid" to close

**Expected Result**: Grid displays correctly, navigation works, visual states accurate.

#### Test 3.3: Question Grid Color Coding
- [ ] Unanswered questions show gray
- [ ] Answered questions show green
- [ ] Flagged questions show yellow
- [ ] Answered + Flagged show yellow with checkmark
- [ ] Current question has blue ring overlay
- [ ] Legend displays correctly

**Expected Result**: Color coding clear and accurate, legend matches behavior.

---

### 4. Flagging System Tests

#### Test 4.1: Flag Questions
- [ ] "Flag" button visible on all questions
- [ ] Click to flag question
- [ ] Button changes to "Flagged" with yellow background
- [ ] Flagged count increases in header
- [ ] Question shows yellow in grid

**Expected Result**: Flagging works, visual feedback immediate.

#### Test 4.2: Unflag Questions
- [ ] Click "Flagged" button
- [ ] Button returns to gray "Flag"
- [ ] Flagged count decreases
- [ ] Question color updates in grid

**Expected Result**: Unflagging works, counts and colors update.

#### Test 4.3: Flag Persistence
- [ ] Flag a question
- [ ] Navigate to another question
- [ ] Navigate back
- [ ] Flag status persists

**Expected Result**: Flags persist across navigation.

---

### 5. Timer Tests (Certification Mode Only)

#### Test 5.1: Timer Display
- [ ] Timer shows in header in format "H:MM:SS"
- [ ] Timer starts at 3:00:00
- [ ] Timer counts down every second
- [ ] Timer color is blue when >30 minutes remain
- [ ] Timer color is yellow when 10-30 minutes remain
- [ ] Timer color is red when <10 minutes remain

**Expected Result**: Timer counts down accurately, color changes work.

#### Test 5.2: Timer Warnings
- [ ] Alert appears at 60 minutes remaining
- [ ] Alert appears at 30 minutes remaining
- [ ] Alert appears at 10 minutes remaining
- [ ] Alert appears at 5 minutes remaining
- [ ] Alerts don't block exam interaction

**Expected Result**: Alerts appear at correct times, dismissible.

#### Test 5.3: Timer Expiration
- [ ] Exam auto-submits at 0:00:00
- [ ] Results screen appears
- [ ] Time taken shows 180 minutes (full duration)

**Expected Result**: Auto-submit works, no errors, correct time recorded.

#### Test 5.4: Timer in Practice Mode
- [ ] Timer not displayed if "Show timer" unchecked
- [ ] No time limit enforced in practice mode
- [ ] Can take unlimited time

**Expected Result**: Timer optional in practice mode.

---

### 6. Progress Tracking Tests

#### Test 6.1: Progress Bar
- [ ] Progress bar shows in header
- [ ] Starts at 0%
- [ ] Increases as you move through questions
- [ ] Reaches 100% at question 100
- [ ] Visual fill is accurate

**Expected Result**: Progress bar updates smoothly, accurate percentage.

#### Test 6.2: Progress Indicators
- [ ] "X Answered" count updates when answering questions
- [ ] "X Flagged" count updates when flagging
- [ ] "X Left" count decreases as questions answered
- [ ] All counts are accurate

**Expected Result**: Live counters accurate, update immediately.

---

### 7. Auto-Save Tests

#### Test 7.1: Auto-Save Functionality
- [ ] Answer some questions
- [ ] Wait 30+ seconds
- [ ] "Last saved" timestamp updates
- [ ] Check browser console - no errors

**Expected Result**: Auto-save runs every 30 seconds, no errors.

#### Test 7.2: Resume After Browser Close
- [ ] Start exam, answer 10 questions
- [ ] Wait for auto-save (30+ seconds)
- [ ] Close browser tab
- [ ] Reopen exam
- [ ] Check localStorage for saved data

**Expected Result**: Progress saved to localStorage, can resume.

#### Test 7.3: Manual Save on Submit
- [ ] Answer questions
- [ ] Submit exam
- [ ] Check localStorage for results

**Expected Result**: Results saved to localStorage.

---

### 8. Answer Validation Tests

#### Test 8.1: Multiple Choice Validation
- [ ] Select correct answer - marked correct
- [ ] Select wrong answer - marked incorrect
- [ ] No answer - marked incorrect

**Expected Result**: Exact string match validation works.

#### Test 8.2: True/False Validation
- [ ] Select "true" when correct answer is "true" - marked correct
- [ ] Select "false" when correct answer is "false" - marked correct
- [ ] Wrong selection - marked incorrect

**Expected Result**: Boolean validation works.

#### Test 8.3: Multiple Select Validation
- [ ] Select all correct answers - marked correct
- [ ] Select some correct + some wrong - marked incorrect
- [ ] Select subset of correct - marked incorrect
- [ ] Must select exact set of correct answers

**Expected Result**: Array comparison works, order doesn't matter.

#### Test 8.4: Fill-in-Blank Validation
- [ ] Enter exact correct number - marked correct
- [ ] Enter number within tolerance - marked correct
- [ ] Enter number outside tolerance - marked incorrect
- [ ] Test with: 100000 (tolerance ±1000)
  - [ ] 100000 - correct
  - [ ] 100500 - correct
  - [ ] 99500 - correct
  - [ ] 101500 - incorrect
  - [ ] 98000 - incorrect

**Expected Result**: Numeric validation with tolerance works correctly.

---

### 9. Practice Mode Tests

#### Test 9.1: Immediate Feedback
- [ ] In practice mode, answer a question
- [ ] Explanation appears immediately below
- [ ] Shows "Correct" or "Incorrect" indicator
- [ ] Explanation text displays

**Expected Result**: Instant feedback after answering.

#### Test 9.2: No Timer Restriction
- [ ] Practice mode has no time limit
- [ ] Can take as long as needed
- [ ] No timer warnings

**Expected Result**: Unlimited time in practice mode.

#### Test 9.3: Multiple Attempts
- [ ] Can retake practice exam unlimited times
- [ ] No waiting period required

**Expected Result**: Unlimited retakes in practice mode.

---

### 10. Certification Mode Tests

#### Test 10.1: No Immediate Feedback
- [ ] In certification mode, answer questions
- [ ] No explanation appears
- [ ] No correct/incorrect indicator
- [ ] Must wait until submission

**Expected Result**: No feedback during exam, only after submission.

#### Test 10.2: Time Limit Enforced
- [ ] 3-hour timer displays
- [ ] Auto-submit at 0:00
- [ ] Cannot continue after time expires

**Expected Result**: Strict time enforcement.

#### Test 10.3: One Attempt Per Day (Honor System)
- [ ] Warning message about one attempt
- [ ] Track last attempt timestamp
- [ ] Check if 24 hours passed

**Expected Result**: Honor system messaging, timestamp tracking.

---

### 11. Submission Tests

#### Test 11.1: Submit Button Availability
- [ ] "Submit Exam" appears on question 100
- [ ] Can submit from any question via confirmation dialog
- [ ] Confirmation dialog warns about unanswered questions

**Expected Result**: Can submit from question 100 easily, warning for early submission.

#### Test 11.2: Submission Confirmation
- [ ] Click "Submit Exam"
- [ ] Confirmation dialog appears
- [ ] Shows count of answered questions
- [ ] Can cancel to continue exam
- [ ] Can confirm to submit

**Expected Result**: Clear confirmation dialog, can cancel.

#### Test 11.3: Submission Process
- [ ] Confirm submission
- [ ] Exam interface disappears
- [ ] Results calculation (loading if needed)
- [ ] Results screen appears
- [ ] Timer stops

**Expected Result**: Smooth transition to results, no errors.

---

### 12. Results Screen Tests

#### Test 12.1: Score Display
- [ ] Total score displays (e.g., "186/230")
- [ ] Percentage displays (e.g., "81%")
- [ ] Pass/Fail indicator shows correctly
- [ ] Grade displays (A+ through F)
- [ ] Time taken shows correctly

**Expected Result**: All score information accurate and clear.

#### Test 12.2: Topic Breakdown
- [ ] All 6 topics listed
- [ ] Each shows questions correct/total
- [ ] Each shows points earned/possible
- [ ] Each shows percentage
- [ ] Each shows pass/fail indicator (if applicable)
- [ ] Progress bars display

**Expected Result**: Detailed topic-level analysis accurate.

#### Test 12.3: Difficulty Breakdown
- [ ] All 4 difficulty levels listed
- [ ] Each shows questions correct/total
- [ ] Each shows points earned/possible
- [ ] Each shows percentage
- [ ] Progress bars display

**Expected Result**: Difficulty-level analysis accurate.

#### Test 12.4: Weak Areas
- [ ] Topics below 75% appear in weak areas
- [ ] Shows percentage and questions wrong
- [ ] Sorted by percentage (lowest first)
- [ ] If no weak areas, section doesn't appear

**Expected Result**: Weak areas correctly identified and prioritized.

#### Test 12.5: Certificate (Pass Only)
- [ ] If passed (≥80%), certificate section shows
- [ ] Shows certificate earned message
- [ ] "Download Certificate" button displays
- [ ] Click button generates PDF
- [ ] PDF contains all required information
- [ ] If failed (<80%), certificate section hidden

**Expected Result**: Certificate only for passing grades, PDF generates correctly.

#### Test 12.6: Result Actions
- [ ] "Retake Exam" button returns to configuration
- [ ] "View All Answers" button works (if implemented)
- [ ] "Download Certificate" generates PDF

**Expected Result**: All action buttons work correctly.

---

### 13. Certificate Generation Tests

#### Test 13.1: Certificate Content
- [ ] Student name displays
- [ ] Completion date shows
- [ ] Final score and percentage show
- [ ] Grade displays
- [ ] Competencies list shows (topics passed)
- [ ] Certificate ID is unique
- [ ] Professional formatting

**Expected Result**: Certificate is professional and complete.

#### Test 13.2: Certificate PDF
- [ ] PDF downloads automatically
- [ ] Filename format: "Accountrix_Certificate_[Name]_[Date].pdf"
- [ ] PDF is landscape orientation
- [ ] All text is readable
- [ ] Borders and styling look professional

**Expected Result**: PDF is high-quality and printer-ready.

#### Test 13.3: Multiple Certificate Downloads
- [ ] Can download certificate multiple times
- [ ] Same certificate ID each time
- [ ] No errors on repeat downloads

**Expected Result**: Reliable repeat downloads.

---

### 14. Data Persistence Tests

#### Test 14.1: localStorage Keys
- [ ] Check `cpa-exam-[examId]` - exam configuration
- [ ] Check `cpa-exam-progress-[examId]` - current progress
- [ ] Check `cpa-exam-results-[examId]` - final results

**Expected Result**: All data properly saved to localStorage.

#### Test 14.2: Progress Persistence
- [ ] Start exam
- [ ] Answer 20 questions
- [ ] Close browser (hard close)
- [ ] Reopen page
- [ ] Check if can resume

**Expected Result**: Can resume from where left off.

#### Test 14.3: Data Cleanup
- [ ] Submit exam
- [ ] Check that progress data deleted
- [ ] Results data persists

**Expected Result**: Progress cleared on submit, results saved.

---

### 15. Edge Case Tests

#### Test 15.1: All Questions Unanswered
- [ ] Submit exam without answering any questions
- [ ] Confirmation shows "0 Answered"
- [ ] Results show 0/230 (0%)
- [ ] No certificate generated

**Expected Result**: Handles 0 answers gracefully.

#### Test 15.2: All Questions Answered Incorrectly
- [ ] Answer all questions wrong
- [ ] Submit exam
- [ ] Results show low score
- [ ] All topics show 0%
- [ ] Weak areas show all topics

**Expected Result**: Handles all wrong answers correctly.

#### Test 15.3: Perfect Score
- [ ] Answer all 100 questions correctly
- [ ] Submit exam
- [ ] Results show 230/230 (100%)
- [ ] Grade is A+
- [ ] All topics show 100%
- [ ] No weak areas

**Expected Result**: Perfect score handled correctly.

#### Test 15.4: Exactly 80% (Borderline Pass)
- [ ] Score exactly 184/230 points
- [ ] Results show "PASSED"
- [ ] Certificate generated

**Expected Result**: Exact passing threshold works.

#### Test 15.5: Just Below 80% (Borderline Fail)
- [ ] Score 183/230 points
- [ ] Results show "DID NOT PASS"
- [ ] No certificate

**Expected Result**: Just below threshold fails correctly.

---

### 16. Accessibility Tests

#### Test 16.1: Keyboard Navigation
- [ ] Tab key navigates through questions
- [ ] Enter key selects options
- [ ] Arrow keys navigate (if implemented)
- [ ] Escape key closes dialogs

**Expected Result**: Full keyboard navigation support.

#### Test 16.2: Screen Reader
- [ ] Run with screen reader (NVDA/JAWS)
- [ ] All buttons have labels
- [ ] All form elements have labels
- [ ] Question text is read correctly

**Expected Result**: Screen reader compatible.

#### Test 16.3: Color Contrast
- [ ] Use contrast checker tool
- [ ] All text meets WCAG AA standards
- [ ] Color coding has text backup (not just color)

**Expected Result**: High contrast, accessible colors.

#### Test 16.4: Responsive Design
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] All features work on all sizes

**Expected Result**: Fully responsive, no broken layouts.

---

### 17. Performance Tests

#### Test 17.1: Load Time
- [ ] Measure initial page load
- [ ] Should be <3 seconds on good connection

**Expected Result**: Fast initial load.

#### Test 17.2: Question Navigation Speed
- [ ] Navigate through 100 questions
- [ ] Should be instant, no lag

**Expected Result**: Smooth navigation, no delays.

#### Test 17.3: Large Data Handling
- [ ] Answer all 100 questions
- [ ] Check Map size (100 entries)
- [ ] Submit exam
- [ ] Results calculation should be <1 second

**Expected Result**: Handles full dataset efficiently.

---

### 18. Error Handling Tests

#### Test 18.1: Invalid Inputs
- [ ] Fill-in-blank: enter non-numeric text
- [ ] Should show error or ignore

**Expected Result**: Graceful handling of invalid inputs.

#### Test 18.2: localStorage Full
- [ ] Fill localStorage (rare edge case)
- [ ] Try to save progress
- [ ] Should show error message or fallback

**Expected Result**: Error message displayed, doesn't crash.

#### Test 18.3: Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge

**Expected Result**: Works on all major browsers.

---

### 19. Security Tests

#### Test 19.1: Answer Tampering
- [ ] Open browser DevTools
- [ ] Try to modify answers in localStorage
- [ ] Submit exam
- [ ] Validation should still work correctly

**Expected Result**: Client-side validation, honor system.

#### Test 19.2: Certificate Validation
- [ ] Generate certificate
- [ ] Check certificate ID format
- [ ] Verify uniqueness

**Expected Result**: Unique, verifiable certificate IDs.

---

### 20. Integration Tests

#### Test 20.1: PDF Export Integration
- [ ] Pass exam
- [ ] Click "Download Certificate"
- [ ] PDF library loads correctly
- [ ] PDF generates without errors
- [ ] PDF downloads successfully

**Expected Result**: Seamless PDF export.

#### Test 20.2: User Progress Integration
- [ ] Complete exam
- [ ] Check if user progress updated (if integrated)
- [ ] Verify XP awarded (if applicable)
- [ ] Verify badge unlocked (if applicable)

**Expected Result**: Progress tracking works.

---

## Automated Testing

### Unit Tests
```typescript
// Example unit tests for answer validation
describe('checkAnswer', () => {
  it('validates multiple choice correctly', () => {
    const question = { correctAnswer: 'Option A' };
    expect(checkAnswer(question, 'Option A')).toBe(true);
    expect(checkAnswer(question, 'Option B')).toBe(false);
  });

  it('validates fill-blank with tolerance', () => {
    const question = { correctAnswer: 100000, tolerance: 1000 };
    expect(checkAnswer(question, 100000)).toBe(true);
    expect(checkAnswer(question, 100500)).toBe(true);
    expect(checkAnswer(question, 99500)).toBe(true);
    expect(checkAnswer(question, 101500)).toBe(false);
  });
});
```

### End-to-End Tests
```typescript
// Example E2E test with Playwright
test('complete full exam flow', async ({ page }) => {
  await page.goto('/exam');
  await page.click('text=Start Certification Exam');

  // Answer 100 questions
  for (let i = 0; i < 100; i++) {
    await page.click('[data-testid="option-a"]');
    await page.click('[data-testid="next-button"]');
  }

  await page.click('text=Submit Exam');
  await page.click('text=Confirm');

  // Verify results screen
  await expect(page.locator('text=CPA FINAL EXAM RESULTS')).toBeVisible();
});
```

---

## Test Report Template

### Test Session Information
- **Date**: _____________
- **Tester**: _____________
- **Browser**: _____________
- **Version**: _____________
- **Environment**: _____________

### Summary
- **Total Tests**: _____
- **Passed**: _____
- **Failed**: _____
- **Skipped**: _____
- **Pass Rate**: _____%

### Failed Tests
| Test ID | Description | Expected | Actual | Severity |
|---------|-------------|----------|--------|----------|
| | | | | |

### Issues Found
| Issue # | Description | Steps to Reproduce | Severity | Status |
|---------|-------------|-------------------|----------|---------|
| | | | | |

### Recommendations
- _____________
- _____________
- _____________

---

## Sign-Off

### Tester Approval
- [ ] All critical tests passed
- [ ] All blockers resolved
- [ ] Ready for production

**Signature**: _____________ **Date**: _____________

### Developer Approval
- [ ] All issues addressed
- [ ] Code reviewed
- [ ] Documentation complete

**Signature**: _____________ **Date**: _____________

---

## Continuous Testing Checklist

Run these tests before every release:

- [ ] Configuration screen displays correctly
- [ ] All question types render properly
- [ ] Navigation works smoothly
- [ ] Timer functions correctly (certification mode)
- [ ] Answers persist across navigation
- [ ] Submit process works
- [ ] Results calculation is accurate
- [ ] Certificate generates for passing grades
- [ ] Auto-save works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] PDF export works

---

**Last Updated**: January 2025
**Version**: 1.0.0
