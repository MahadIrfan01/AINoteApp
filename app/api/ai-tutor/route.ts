import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    console.log('[AI Tutor] Request received:', { hasMessage: !!message, messageLength: message?.length })

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    console.log('[AI Tutor] API key check:', { hasApiKey: !!apiKey })

    if (!apiKey) {
      console.error('[AI Tutor] API key not configured')
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Build conversation context
    let conversationContext = 'You are a helpful, patient, and knowledgeable AI tutor. Your role is to:\n'
    conversationContext += '- Explain concepts clearly and simply\n'
    conversationContext += '- Break down complex topics into understandable parts\n'
    conversationContext += '- Provide examples and analogies when helpful\n'
    conversationContext += '- Ask clarifying questions if needed\n'
    conversationContext += '- Encourage learning and critical thinking\n'
    conversationContext += '- Be supportive and encouraging\n\n'

    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext += 'Previous conversation:\n'
      conversationHistory.forEach((msg: any) => {
        conversationContext += `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}\n`
      })
      conversationContext += '\n'
    }

    conversationContext += `Student: ${message}\nTutor:`

    console.log('[AI Tutor] Calling Gemini API...')

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    // Generate response
    const result = await model.generateContent(conversationContext)
    const response = await result.response
    const aiResponse = response.text()

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    console.log('[AI Tutor] Success! Response length:', aiResponse.length)

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('[AI Tutor] Error:', error.message, error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}
