'use client'

import { useState, useEffect } from 'react'

type FollowerRange = 'under5k' | '5k-10k' | '10k-50k' | '50k-100k' | '100k+'
type ContentNiche = 'fitness' | 'business' | 'marketing' | 'education' | 'tech' | 'lifestyle' | 'fashion' | 'food' | 'travel' | 'other'

const FOLLOWER_OPTIONS: { value: FollowerRange; label: string }[] = [
  { value: 'under5k', label: 'Under 5K' },
  { value: '5k-10k', label: '5K – 10K' },
  { value: '10k-50k', label: '10K – 50K' },
  { value: '50k-100k', label: '50K – 100K' },
  { value: '100k+', label: '100K+' },
]

const NICHE_OPTIONS: { value: ContentNiche; label: string }[] = [
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'tech', label: 'Tech & Software' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'fashion', label: 'Fashion & Beauty' },
  { value: 'food', label: 'Food & Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
]

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

export default function CreatorsForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    instagramUsername: '',
    followerRange: '' as FollowerRange | '',
    contentNiche: '' as ContentNiche | '',
    otherNiche: '',
    asksForComments: false,
    whyJoin: '',
    termsAndConditions: false,
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [spotsRemaining, setSpotsRemaining] = useState<number | null>(null)
  const [spotsCap, setSpotsCap] = useState(50)

  useEffect(() => {
    fetch('/api/creators')
      .then(r => r.json())
      .then(data => {
        if (typeof data.spotsCap === 'number' && data.spotsCap > 0) setSpotsCap(data.spotsCap)
        if (typeof data.spotsRemaining === 'number') setSpotsRemaining(data.spotsRemaining)
      })
      .catch(() => {
        setSpotsCap(50)
        setSpotsRemaining(47)
      })
  }, [])

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: false }))
    if (error) setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const errs: Record<string, boolean> = {}
    if (!formData.name.trim()) errs.name = true
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = true
    if (!formData.country.trim()) errs.country = true
    if (!formData.instagramUsername.trim()) errs.instagramUsername = true
    if (!formData.followerRange) errs.followerRange = true
    if (!formData.contentNiche) errs.contentNiche = true
    if (formData.contentNiche === 'other' && !formData.otherNiche.trim()) errs.otherNiche = true
    if (!formData.termsAndConditions) errs.termsAndConditions = true

    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }

    setLoading(true)
    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          instagramUrl: `https://instagram.com/${formData.instagramUsername}`,
          device: getDeviceInfo(),
          source: getSourceInfo(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.alreadyApplied ? 'You have already applied to the Creators Program!' : data.error || 'Something went wrong.')
        return
      }
      if (typeof data.spotsRemaining === 'number') setSpotsRemaining(Math.max(0, data.spotsRemaining))
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#b20d8f] focus:ring-2 focus:ring-[#b20d8f]/20 ${fieldErrors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`

  const chipClass = (active: boolean, hasError?: boolean) =>
    `rounded-xl border px-3 py-2 text-sm font-medium transition-all cursor-pointer ${active
      ? 'bg-[#b20d8f] border-[#b20d8f] text-white shadow-sm'
      : hasError
        ? 'border-red-300 text-gray-700 hover:border-[#b20d8f]/50'
        : 'border-gray-200 text-gray-700 hover:border-[#b20d8f]/50 bg-white'
    }`

  if (submitted) {
    return (
      <div className="text-center py-16 px-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          We've sent a confirmation to <strong>{formData.email}</strong>. Our team reviews all applications manually and will get back to you within 48–72 hours.
        </p>
        <div className="mt-8 space-y-3">
          <p className="text-sm font-semibold text-gray-700">While you wait:</p>
          <a
            href="https://instagram.com/liffio"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#b20d8f] hover:underline text-sm"
          >
            → Follow us on Instagram @liffio
          </a>
          <a
            href={`https://instagram.com/${formData.instagramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#b20d8f] hover:underline text-sm"
          >
            → View your submitted profile @{formData.instagramUsername}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {spotsRemaining !== null && (
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-600">
            {spotsRemaining > 0 ? `${spotsRemaining} of ${spotsCap} spots remaining` : 'All spots have been claimed'}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Section 1 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#b20d8f] text-white text-xs flex items-center justify-center font-bold">1</span>
          Your Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="John Doe" value={formData.name} onChange={e => updateField('name', e.target.value)} disabled={loading} className={inputClass('name')} />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-500">Required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
          <input type="email" placeholder="you@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} disabled={loading} className={inputClass('email')} />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">Enter a valid email</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Country <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g. India, United States" value={formData.country} onChange={e => updateField('country', e.target.value)} disabled={loading} className={inputClass('country')} />
          {fieldErrors.country && <p className="mt-1 text-xs text-red-500">Required</p>}
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-5">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#b20d8f] text-white text-xs flex items-center justify-center font-bold">2</span>
          Instagram Profile
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Username <span className="text-red-500">*</span></label>
          <div className={`flex items-center rounded-xl border transition-colors focus-within:border-[#b20d8f] focus-within:ring-2 focus-within:ring-[#b20d8f]/20 ${fieldErrors.instagramUsername ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <span className="px-3 text-gray-400 text-sm font-medium select-none">@</span>
            <input
              type="text"
              placeholder="yourusername"
              value={formData.instagramUsername}
              onChange={e => updateField('instagramUsername', e.target.value.replace(/^@/, ''))}
              disabled={loading}
              className="flex-1 bg-transparent py-3 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
          {fieldErrors.instagramUsername && <p className="mt-1 text-xs text-red-500">Required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Follower Count <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {FOLLOWER_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => updateField('followerRange', opt.value)} disabled={loading}
                className={chipClass(formData.followerRange === opt.value, fieldErrors.followerRange)}>
                {opt.label}
              </button>
            ))}
          </div>
          {fieldErrors.followerRange && <p className="mt-1 text-xs text-red-500">Please select a range</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Niche <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {NICHE_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => updateField('contentNiche', opt.value)} disabled={loading}
                className={chipClass(formData.contentNiche === opt.value, fieldErrors.contentNiche)}>
                {opt.label}
              </button>
            ))}
          </div>
          {fieldErrors.contentNiche && <p className="mt-1 text-xs text-red-500">Please select a niche</p>}
          {formData.contentNiche === 'other' && (
            <div className="mt-2">
              <input type="text" placeholder="Specify your niche" value={formData.otherNiche} onChange={e => updateField('otherNiche', e.target.value)} disabled={loading} className={inputClass('otherNiche')} />
              {fieldErrors.otherNiche && <p className="mt-1 text-xs text-red-500">Required when niche is Other</p>}
            </div>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => !loading && updateField('asksForComments', !formData.asksForComments)}
            className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${formData.asksForComments ? 'bg-[#b20d8f] border-[#b20d8f]' : 'border-gray-300 bg-white'}`}
          >
            {formData.asksForComments && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600 leading-relaxed">
            I already ask followers to comment on posts (e.g. &ldquo;comment LINK to get the guide&rdquo;)
          </span>
        </label>
      </div>

      {/* Section 3 */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#b20d8f] text-white text-xs flex items-center justify-center font-bold">3</span>
          Tell Us About Yourself
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Why do you want to join? <span className="text-gray-400">(Optional)</span></label>
          <textarea
            placeholder="Tell us a bit about your content and how you'd use Liffio..."
            value={formData.whyJoin}
            onChange={e => updateField('whyJoin', e.target.value)}
            disabled={loading}
            rows={4}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none transition-colors focus:border-[#b20d8f] focus:ring-2 focus:ring-[#b20d8f]/20"
          />
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => !loading && updateField('termsAndConditions', !formData.termsAndConditions)}
          className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${formData.termsAndConditions ? 'bg-[#b20d8f] border-[#b20d8f]' : fieldErrors.termsAndConditions ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
        >
          {formData.termsAndConditions && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-600 leading-relaxed">
          I agree to the{' '}
          <a href="/terms-of-service" className="text-[#b20d8f] hover:underline">Terms of Service</a>,{' '}
          <a href="/privacy-policy" className="text-[#b20d8f] hover:underline">Privacy Policy</a>, and{' '}
          <a href="/creators-policy" className="text-[#b20d8f] hover:underline">Creators Program Policy</a> *
        </span>
      </label>
      {fieldErrors.termsAndConditions && <p className="text-xs text-red-500">You must agree to the terms</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        style={{ background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f5184c, #b20d8f)' }}
      >
        {loading ? 'Submitting...' : 'Apply to Creators Program →'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        All applications are reviewed manually. Accepted creators are notified within 48–72 hours.
      </p>
    </form>
  )
}
