import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import {
  sendWelcomeEmail,
  getOfferTier,
  getOfferDetails,
  sendPreRegistrationAlert,
} from '@/lib/email/index'
import { PreRegistration } from '@/lib/types'
import { siteConfig } from '@/config/site.config'

function generateDiscountCode(tier: 'tier1' | 'tier2'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const prefix = tier === 'tier1' ? 'LFF50' : 'LFF10'
  let code = prefix
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, device, source } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const collection = await getCollection<any>('registrations')

    const existingUser = await collection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered', alreadyRegistered: true },
        { status: 409 }
      )
    }

    const totalRegistrations = await collection.countDocuments()
    const spotNumber = totalRegistrations + 1

    const tier = getOfferTier(spotNumber)
    const offerDetails = getOfferDetails(tier)
    const discountCode = tier !== 'tier3' ? generateDiscountCode(tier) : null
    const clientIP = getClientIP(request)

    const registration: PreRegistration = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      registeredAt: new Date(),
      spotNumber,
      discountCode: discountCode || '',
      emailSent: false,
      source: {
        referrer: source?.referrer || null,
        utmSource: source?.utmSource || null,
        utmMedium: source?.utmMedium || null,
        utmCampaign: source?.utmCampaign || null,
      },
      device: {
        userAgent: device?.userAgent || request.headers.get('user-agent') || '',
        platform: device?.platform || '',
        language: device?.language || '',
        screenWidth: device?.screenWidth || 0,
        screenHeight: device?.screenHeight || 0,
        isMobile: device?.isMobile || false,
      },
      location: {
        ip: clientIP,
        timezone: device?.timezone || undefined,
      },
    }

    const result = await collection.insertOne(registration as any)

    const emailResult = await sendWelcomeEmail({
      name: registration.name,
      email: registration.email,
      discountCode,
      spotNumber,
      tier,
    })

    await sendPreRegistrationAlert({
      name: registration.name,
      email: registration.email,
      spotNumber,
      tier,
    })

    if (emailResult.success) {
      await collection.updateOne({ _id: result.insertedId }, { $set: { emailSent: true } })
    }

    const updatedCount = await collection.countDocuments()
    const { offers } = siteConfig

    const tier1Remaining = Math.max(0, offers.tier1.maxSpots - updatedCount)
    const tier2Remaining = updatedCount >= offers.tier1.maxSpots
      ? Math.max(0, offers.tier2.maxSpots - updatedCount)
      : offers.tier2.maxSpots - offers.tier1.maxSpots

    return NextResponse.json({
      success: true,
      spotNumber,
      tier,
      discount: offerDetails.discount,
      totalClaimed: updatedCount,
      tier1Remaining,
      tier2Remaining,
      emailSent: emailResult.success,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const collection = await getCollection<any>('registrations')
    const count = await collection.countDocuments()
    const { offers } = siteConfig

    const currentTier = getOfferTier(count + 1)
    const currentOffer = getOfferDetails(currentTier)

    const tier1Remaining = Math.max(0, offers.tier1.maxSpots - count)
    const tier2Remaining = count >= offers.tier1.maxSpots
      ? Math.max(0, offers.tier2.maxSpots - count)
      : offers.tier2.maxSpots - offers.tier1.maxSpots

    return NextResponse.json({
      totalClaimed: count,
      currentTier,
      currentDiscount: currentOffer.discount,
      tier1Remaining,
      tier2Remaining,
      tier1MaxSpots: offers.tier1.maxSpots,
      tier2MaxSpots: offers.tier2.maxSpots,
    })
  } catch (error) {
    console.error('Failed to get registration count:', error)
    return NextResponse.json({ error: 'Failed to get count' }, { status: 500 })
  }
}
