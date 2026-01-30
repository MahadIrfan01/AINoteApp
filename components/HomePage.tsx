'use client'

interface HomePageProps {
  onNavigate: (page: string) => void
  classCount: number
  quizCount: number
}

export default function HomePage({ onNavigate, classCount, quizCount }: HomePageProps) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'morning' : currentHour < 18 ? 'afternoon' : 'evening'
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Good <span className="text-indigo-600">{greeting}</span>
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Ready to start today's learning session?
        </p>
        <p className="text-center text-gray-500 text-sm mt-2">
          {currentDate}
        </p>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About NoteAI</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          NoteAI is your intelligent study companion that helps you organize your classes, take notes, 
          and generate AI-powered quizzes to test your knowledge. Our platform uses advanced AI technology 
          to transform your notes into interactive learning experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-600">
            <h3 className="font-semibold text-gray-900 mb-2">Organize Notes</h3>
            <p className="text-sm text-gray-600">Keep your study materials organized by class and topic</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-600">
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Quizzes</h3>
            <p className="text-sm text-gray-600">Generate custom quizzes from your notes instantly</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-pink-600">
            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Classes</p>
          <p className="text-3xl font-bold text-gray-900">{classCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Quizzes Taken</p>
          <p className="text-3xl font-bold text-gray-900">{quizCount}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('classes')}
            className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 text-left"
          >
            <h4 className="font-semibold text-gray-900">Create New Class</h4>
            <p className="text-sm text-gray-600">Start organizing your notes</p>
          </button>
          <button
            onClick={() => onNavigate('quiz-history')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 text-left"
          >
            <h4 className="font-semibold text-gray-900">View Quiz History</h4>
            <p className="text-sm text-gray-600">Review your past performance</p>
          </button>
        </div>
      </div>
    </div>
  )
}
