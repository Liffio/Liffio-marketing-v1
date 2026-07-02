'use client'

import { useState } from 'react'
import AppLink from '@/components/AppLink'

function getDeviceInfo() {
  if (typeof window === 'undefined') return {}
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    isMobile,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

function getSourceInfo() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    referrer: document.referrer || null,
    utmSource: params.get('utm_source'),
    utmMedium: params.get('utm_medium'),
    utmCampaign: params.get('utm_campaign'),
  }
}

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState({ name: false, email: false })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const nameErr = name.trim() === ''
    const emailErr = email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setFieldErrors({ name: nameErr, email: emailErr })
    if (nameErr || emailErr) return

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          device: getDeviceInfo(),
          source: getSourceInfo(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          data.alreadyRegistered
            ? 'This email is already registered! Check your inbox for your access details.'
            : data.error || 'Something went wrong. Please try again.'
        )
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10 px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg,#f5184c,#b20d8f)" }}>
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#0a0a0a] mb-2">You&apos;re in!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          We&apos;ll send your early access details to <strong className="text-[#0a0a0a]">{email}</strong>. Check your inbox.
        </p>
      </div>
    )
  }

  const inputClass = (hasErr: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-[#0a0a0a] placeholder-gray-400 outline-none transition-all duration-150 focus:ring-2 focus:ring-[#f5184c]/25 focus:border-[#f5184c] ${
      hasErr ? 'border-red-400 bg-red-50' : 'border-[#ffe4e6] bg-[#fff7f7]'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={e => { setName(e.target.value); setFieldErrors(v => ({ ...v, name: false })); setError(null) }}
          disabled={loading}
          className={inputClass(fieldErrors.name)}
        />
        {fieldErrors.name && <p className="mt-1 text-xs text-red-500">Please enter your name</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => { setEmail(e.target.value); setFieldErrors(v => ({ ...v, email: false })); setError(null) }}
          disabled={loading}
          className={inputClass(fieldErrors.email)}
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-500">Enter a valid email address</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ background: loading ? '#9ca3af' : 'linear-gradient(135deg,#f5184c,#b20d8f)', boxShadow: loading ? 'none' : '0 4px 20px rgba(178, 13, 143,0.28)' }}
      >
        {loading ? 'Creating your account…' : 'Get Started Free →'}
      </button>

      <AppLink href="/creators-program"
        className="block text-center text-xs text-[#f5184c] hover:underline mt-1">
        Content creator with 5K+ followers? Apply for the free Creators Program →
      </AppLink>

      <p className="text-[11px] text-gray-400 text-center leading-relaxed pt-1">
        By signing up, you agree to our{' '}
        <AppLink href="/terms-of-service" className="underline hover:text-[#f5184c] transition-colors">Terms</AppLink>
        {' '}and{' '}
        <AppLink href="/privacy-policy" className="underline hover:text-[#f5184c] transition-colors">Privacy Policy</AppLink>.
        No credit card required.
      </p>
    </form>
  )
}
