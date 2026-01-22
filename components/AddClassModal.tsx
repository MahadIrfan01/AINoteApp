'use client'

import { useState } from 'react'

interface AddClassModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string) => void
}

export default function AddClassModal({ isOpen, onClose, onAdd }: AddClassModalProps) {
  const [className, setClassName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!className.trim()) return

    setIsSubmitting(true)
    try {
      await onAdd(className.trim())
      setClassName('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Class</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Mathematics 101"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
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
              disabled={!className.trim() || isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
