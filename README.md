# Student Note Taker

A simple yet elegant note-taking application built with Next.js, TypeScript, Supabase, and AI-powered quiz generation.

## Features

- **Class Management**: Add and organize classes
- **Note Taking**: Add and delete notes for each class
- **AI Quiz Generation**: Generate quizzes from your notes using Google Gemini
- **Modern UI**: Clean, elegant design with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Google Gemini API key (for quiz generation)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL from `supabase-schema.sql` to create the necessary tables
4. Go to Settings > API to get your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

**Security Note**: 
- The `.env.local` file is already in `.gitignore`, so your API keys will **never** be committed to GitHub
- Never share your API keys publicly
- When deploying to Vercel, add environment variables through Vercel's dashboard (not in code)
- If you accidentally commit an API key, rotate it immediately in your provider's dashboard

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-quiz/    # API route for quiz generation
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── AddClassModal.tsx      # Modal for adding classes
│   ├── ClassCard.tsx          # Class card component
│   ├── NoteEditor.tsx         # Note editor modal
│   └── QuizGenerator.tsx      # Quiz generator component
├── lib/
│   └── supabase.ts            # Supabase client configuration
└── supabase-schema.sql        # Database schema
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Supabase**: Backend database and API
- **Google Gemini API**: AI-powered quiz generation
- **Tailwind CSS**: Styling

## License

MIT
