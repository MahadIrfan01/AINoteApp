# NoteAI - Intelligent Study Companion

A professional note-taking and quiz generation platform powered by AI technology.

## Features

- **Organized Note Management** - Create classes and organize your study materials
- **AI-Powered Quiz Generation** - Automatically generate quizzes from your notes using Google Gemini
- **Split-Screen Quiz Interface** - Reference your notes while taking quizzes
- **Quiz History Tracking** - Review past performance and track progress
- **Analytics Dashboard** - Monitor your learning statistics
- **Collaboration** - Invite others to access and share notes

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file with required variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   GOOGLE_GEMINI_API_KEY=your_gemini_key
   ```

4. Set up database schema:
   - Go to your Supabase Dashboard
   - Navigate to SQL Editor
   - Copy and execute the content from `supabase-schema.sql`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses four main tables:

- **classes** - Store class information
- **notes** - Store notes associated with classes
- **quiz_results** - Track completed quizzes and scores
- **invitations** - Manage email invitations for collaboration

Run the SQL script in `supabase-schema.sql` to create all necessary tables and indexes.

## Usage Guide

### Creating Classes and Notes

1. Click "Add Class" to create a new class
2. Add notes to your class using the "Add Note" button
3. Edit or delete notes as needed

### Generating and Taking Quizzes

1. Click "Generate Quiz" on any class with notes
2. The AI will create questions based on your notes
3. Use the split-screen interface to reference notes while answering
4. Click "Finish Quiz" when complete
5. Confirm submission to view results and save to history

### Viewing History and Analytics

- **Quiz History**: Review all past quizzes with detailed breakdowns
- **Analytics**: Track total classes, notes, quizzes, and average scores

### Inviting Collaborators

1. Click "Invite People" in the top navigation
2. Enter email addresses of collaborators
3. Add an optional personal message
4. Send invitations

## Project Structure

```
AINoteApp-main/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main application page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── HomePage.tsx      # Dashboard page
│   ├── ClassesPage.tsx   # Classes management
│   ├── QuizGenerator.tsx # Quiz interface
│   ├── QuizHistoryPage.tsx
│   ├── AnalyticsPage.tsx
│   └── InvitePeopleModal.tsx
├── lib/                   # Utilities and configuration
│   └── supabase.ts       # Supabase client
└── supabase-schema.sql   # Database schema
```

## Key Features Explained

### Split-Screen Quiz Interface

The quiz interface displays your notes on the left (33% width) and questions on the right (67% width). Both panels scroll independently, allowing you to reference your materials while answering questions.

### Quiz Validation

The system ensures all questions are answered before submission. If any questions are unanswered, you'll receive a prompt to complete them. A confirmation dialog appears before final submission.

### Performance Tracking

Quiz results are color-coded:
- Green: 80% or higher
- Yellow: 60-79%
- Red: Below 60%

### Database Integration

All quiz results are automatically saved to the database, including:
- Score and total questions
- Complete question and answer data
- Timestamp of completion
- Class association

## API Routes

- `/api/generate-quiz` - POST endpoint for AI quiz generation

## Environment Variables

Required variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous key
GOOGLE_GEMINI_API_KEY=           # Google Gemini API key
```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run production server:
```bash
npm start
```

## Security Notes

- Row Level Security (RLS) is available in Supabase schema but commented out
- Enable RLS policies for production use
- Implement proper authentication before deploying
- Never commit `.env.local` to version control

## Troubleshooting

**Database tables not found**
- Run the SQL schema in your Supabase dashboard

**Quiz not generating**
- Verify Gemini API key is set correctly
- Check that notes exist for the class

**Quiz history not showing**
- Ensure database schema includes quiz_results table
- Verify quizzes were completed and submitted

## License

This project is for educational purposes.

## Support

For issues or questions, please check the database schema and environment variables first.

---

Version: 2.1.0
Last Updated: January 2026
