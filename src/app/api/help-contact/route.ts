import { NextRequest, NextResponse } from 'next/server'
import { sendHelpContactMessage } from '@/lib/email/index'
import { clientIp, createRateLimiter } from '@/lib/rate-limit.server'

const helpContactLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  if (!helpContactLimiter(clientIp(request.headers))) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429 },
    )
  }

  try {
    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const result = await sendHelpContactMessage({ name, email, subject, message })
    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send your message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Help contact error:', error)
    return NextResponse.json({ error: 'Failed to send your message' }, { status: 500 })
  }
}
