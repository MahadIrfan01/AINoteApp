# Quiz Reminder Feature

## Overview

The notification bell icon now allows you to set up quiz reminders that integrate with Google Calendar and track scheduled quizzes.

## Features

### 1. Set Quiz Reminders
- Click the bell icon in the top right corner
- Select a class for the quiz
- Choose date and time for the reminder
- Enter your Gmail address
- System creates a Google Calendar event automatically

### 2. Google Calendar Integration
- Opens Google Calendar in a new tab
- Pre-fills event with quiz details
- Sends invitation to your email
- Includes class name and reminder details

### 3. Quiz Status Tracking
Quiz History page now shows two categories:

**Scheduled Quizzes:**
- Upcoming quizzes with reminder set
- Displayed with "Scheduled" badge (indigo color)
- Shows scheduled date and time

**Completed Quizzes:**
- Previously taken quizzes
- Shows score, percentage, and details
- Color-coded performance indicators

## Database Schema

### New Table: reminders
```sql
- id: UUID (primary key)
- class_id: UUID (references classes)
- email: TEXT
- reminder_datetime: TIMESTAMP
- status: TEXT (pending/sent/cancelled)
- created_at: TIMESTAMP
```

### Updated Table: quiz_results
Added columns:
- status: TEXT (completed/scheduled)
- scheduled_date: TIMESTAMP

## How to Use

### Setting a Reminder

1. Click the bell icon (top right)
2. Fill in the form:
   - Select class
   - Choose date (must be future date)
   - Choose time
   - Enter your Gmail address
3. Click "Set Reminder"
4. Google Calendar opens automatically
5. Confirm the calendar event

### Viewing Scheduled Quizzes

1. Go to "Quiz History" page
2. See "Upcoming Quizzes" section at top
3. View all scheduled quizzes with dates
4. Completed quizzes shown below

## Technical Details

### Reminder Flow
```
1. User sets reminder → Modal form
2. Data saved to reminders table
3. Quiz entry created with status="scheduled"
4. Google Calendar URL generated
5. Opens in new tab for user to confirm
```

### Google Calendar URL Format
```
https://calendar.google.com/calendar/render?
  action=TEMPLATE
  &text=[Quiz Reminder: Class Name]
  &details=[Description]
  &dates=[Start]/[End]
  &add=[Email]
```

### Quiz Status Values
- **completed**: Quiz has been taken and scored
- **scheduled**: Quiz is planned for future date

## UI Changes

### Bell Icon
- Located in top navigation bar
- Clickable to open reminder modal
- Hover shows "Set Quiz Reminder" tooltip

### Quiz History Layout
```
Quiz History Page
├── Upcoming Quizzes (if any)
│   └── Cards with indigo borders
│       - Class name
│       - Scheduled date/time
│       - "Scheduled" badge
└── Completed Quizzes
    └── Cards with score details
        - Score percentage
        - Color-coded badges
        - View details button
```

## Database Update Required

Run the SQL in `DATABASE_UPDATE_ONLY.sql`:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the SQL file content
4. Execute

This adds:
- reminders table
- status column to quiz_results
- scheduled_date column to quiz_results
- Necessary indexes

## Benefits

1. **Never Miss a Quiz**: Calendar reminders keep you on track
2. **Email Notifications**: Google Calendar sends email reminders
3. **Visual Tracking**: See upcoming quizzes at a glance
4. **Organization**: Separate scheduled from completed quizzes
5. **Integration**: Works with your existing Google Calendar

## Future Enhancements

Potential improvements:
- Auto-generate quiz at scheduled time
- Send custom email reminders
- Recurring quiz schedules
- Mobile push notifications
- Quiz difficulty selection
- Study time recommendations

## Notes

- Requires Google account for calendar integration
- Calendar event must be manually confirmed by user
- Scheduled quizzes remain until marked completed
- All times are stored in UTC in database
- User timezone is handled by browser/calendar

---

Version: 2.2.0
Feature: Quiz Reminders with Google Calendar Integration
Status: Ready to use after database update
