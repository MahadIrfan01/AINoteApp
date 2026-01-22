import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.')
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
