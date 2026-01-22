'use client'

import { useState } from 'react'

interface NoteEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
}

export default function NoteEditor({ isOpen, onClose, onSave }: NoteEditorProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await onSave(content.trim())
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Note</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="mb-4 flex-1">
            <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <textarea
              id="noteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your notes here..."
              className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
