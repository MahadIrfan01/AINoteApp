'use client'

import { useState, useEffect } from 'react'
import { supabase, Class, Note } from '@/lib/supabase'
import ClassCard from '@/components/ClassCard'
import AddClassModal from '@/components/AddClassModal'

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setClasses(data || [])
    } catch (error: any) {
      console.error('Error fetching classes:', error)
      // Show user-friendly error
      if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
        alert('Database tables not found. Please run the SQL schema in your Supabase dashboard.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddClass = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{ name }])
        .select()
        .single()

      if (error) throw error
      setClasses([data, ...classes])
      setIsAddClassOpen(false)
    } catch (error) {
      console.error('Error adding class:', error)
      alert('Failed to add class. Please try again.')
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class and all its notes?')) {
      return
    }

    try {
      // Delete all notes for this class first
      await supabase.from('notes').delete().eq('class_id', id)
      
      // Then delete the class
      const { error } = await supabase.from('classes').delete().eq('id', id)
      
      if (error) throw error
      setClasses(classes.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Failed to delete class. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Student Note Taker
          </h1>
          <p className="text-gray-600">
            Organize your classes, take notes, and generate AI-powered quizzes
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setIsAddClassOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Class
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-600 text-lg mb-2">No classes yet</p>
            <p className="text-gray-500">Click "Add Class" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                onDelete={handleDeleteClass}
              />
            ))}
          </div>
        )}

        <AddClassModal
          isOpen={isAddClassOpen}
          onClose={() => setIsAddClassOpen(false)}
          onAdd={handleAddClass}
        />
      </div>
    </main>
  )
}
