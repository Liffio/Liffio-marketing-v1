export interface PreRegistration {
  _id?: string
  name: string
  email: string
  registeredAt: Date
  spotNumber: number
  discountCode: string
  emailSent: boolean
  source: {
    referrer: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
  }
  device: {
    userAgent: string
    platform: string
    language: string
    screenWidth: number
    screenHeight: number
    isMobile: boolean
  }
  location: {
    ip: string
    country?: string
    city?: string
    timezone?: string
  }
}

export type FollowerRange = 'under5k' | '5k-10k' | '10k-50k' | '50k-100k' | '100k+'

export type ContentNiche =
  | 'fitness'
  | 'business'
  | 'marketing'
  | 'education'
  | 'tech'
  | 'lifestyle'
  | 'fashion'
  | 'food'
  | 'travel'
  | 'other'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted'

export interface CreatorApplication {
  _id?: string
  name: string
  email: string
  country: string
  instagramUsername: string
  instagramUrl: string
  followerRange: FollowerRange
  contentNiche: ContentNiche
  otherNiche?: string
  asksForComments: boolean
  whyJoin: string
  appliedAt: Date
  status: ApplicationStatus
  emailSent: boolean
  reviewedAt?: Date
  reviewNotes?: string
  decisionReason?: string
  source: {
    referrer: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
  }
  device: {
    userAgent: string
    platform: string
    language: string
    screenWidth: number
    screenHeight: number
    isMobile: boolean
  }
  location: {
    ip: string
    country?: string
    city?: string
    timezone?: string
  }
}
