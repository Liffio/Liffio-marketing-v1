import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/config/site.config'
import { sendCreatorApplicationAlert, sendCreatorsEmail } from '@/lib/email/index'
import { liffioMarketingFetch, getLiffioMarketingUrl } from '@/lib/liffio-api'

const creatorsStatsFallback = () => ({
  spotsCap: siteConfig.creatorsProgram.spotsCap,
  spotsRemaining: siteConfig.creatorsProgram.spotsRemainingFallback,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { ok, status, data } = await liffioMarketingFetch<{
      success?: boolean
      id?: string
      applicationNumber?: number
      spotsRemaining?: number
      spotsCap?: number
      error?: string
      alreadyApplied?: boolean
    }>('/creators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!ok) {
      return NextResponse.json(
        {
          error: data.error || 'Failed to submit application',
          alreadyApplied: data.alreadyApplied,
        },
        { status },
      )
    }

    const emailResult = await sendCreatorsEmail({
      name: body.name,
      email: body.email,
      instagramUsername: body.instagramUsername,
    })

    await sendCreatorApplicationAlert({
      name: body.name,
      email: body.email,
      instagramUsername: body.instagramUsername,
      followerRange: body.followerRange,
      contentNiche:
        body.contentNiche === 'other' && body.otherNiche ? body.otherNiche : body.contentNiche,
    })

    if (emailResult.success && data.id) {
      await fetch(getLiffioMarketingUrl(`/creator-applications/${data.id}/email-sent`), {
        method: 'PATCH',
      }).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      applicationNumber: data.applicationNumber,
      emailSent: emailResult.success,
      spotsRemaining: data.spotsRemaining,
      spotsCap: data.spotsCap,
    })
  } catch (error) {
    console.error('Creator application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { ok, data } = await liffioMarketingFetch<Record<string, unknown>>('/creators')
    if (!ok) {
      return NextResponse.json(creatorsStatsFallback())
    }
    return NextResponse.json({
      ...creatorsStatsFallback(),
      ...data,
      spotsCap:
        typeof data.spotsCap === 'number' && data.spotsCap > 0
          ? data.spotsCap
          : siteConfig.creatorsProgram.spotsCap,
      spotsRemaining:
        typeof data.spotsRemaining === 'number'
          ? data.spotsRemaining
          : siteConfig.creatorsProgram.spotsRemainingFallback,
    })
  } catch (error) {
    console.error('Failed to get creator stats:', error)
    return NextResponse.json(creatorsStatsFallback())
  }
}
