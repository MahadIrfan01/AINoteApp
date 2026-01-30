import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please add it to your .env.local file in the format: NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please add it to your .env.local file.'
  )
}

// Validate URL format
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(
    `Invalid Supabase URL format: "${supabaseUrl}". ` +
    'The URL must start with http:// or https://. ' +
    'Example: https://your-project-id.supabase.co'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Class {
  id: string
  name: string
  created_at: string
}

export interface Note {
  id: string
  class_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  class_id: string
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface QuizResult {
  id: string
  class_id: string
  score: number
  total_questions: number
  questions: any[]
  created_at: string
}
