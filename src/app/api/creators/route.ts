import { NextResponse } from 'next/server'
import { siteConfig } from '@/config/site.config'
import { liffioMarketingFetch } from '@/lib/liffio-api'

/*
  What is left of this route: the spots counter, and nothing else.

  🚩 The POST handler was the Creators application form's submit endpoint. The
  form is gone (creators now apply at app.liffio.com/creators-program), so the
  handler, the two emails it sent and their template are gone with it. GET
  stays because the page still shows how many of the 50 spots remain, which
  was never part of the form.
*/

const creatorsStatsFallback = () => ({
  spotsCap: siteConfig.creatorsProgram.spotsCap,
  spotsRemaining: siteConfig.creatorsProgram.spotsRemainingFallback,
})

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
