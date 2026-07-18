import nodemailer from 'nodemailer'
import { siteConfig } from '@/config/site.config'
import { getWelcomeEmailHtml, getWelcomeEmailText, getWelcomeEmailSubject } from './templates/welcome'
import { getCreatorsEmailHtml, getCreatorsEmailText, getCreatorsEmailSubject } from './templates/creators'
import {
  getCreatorApplicationAlertHtml,
  getCreatorApplicationAlertSubject,
  getCreatorApplicationAlertText,
  getPreRegistrationAlertHtml,
  getPreRegistrationAlertSubject,
  getPreRegistrationAlertText,
} from './templates/internal-notifications'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function getSmtpFromAddress(): string | undefined {
  const v = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim()
  return v || undefined
}

function getAdminNotificationRecipients(): string {
  const raw = process.env.SMTP_ADMIN_TO?.trim()
  if (raw) return raw
  return 'liffiocore@gmail.com'
}

export type OfferTier = 'tier1' | 'tier2' | 'tier3'

export function getOfferTier(spotNumber: number): OfferTier {
  const { offers } = siteConfig
  if (spotNumber <= offers.tier1.maxSpots) return 'tier1'
  if (spotNumber <= offers.tier2.maxSpots) return 'tier2'
  return 'tier3'
}

export function getOfferDetails(tier: OfferTier) {
  return siteConfig.offers[tier]
}

interface SendWelcomeEmailParams {
  name: string
  email: string
  discountCode: string | null
  spotNumber: number
  tier: OfferTier
}

export async function sendWelcomeEmail({ name, email, discountCode, spotNumber, tier }: SendWelcomeEmailParams) {
  const { brand } = siteConfig
  const offer = getOfferDetails(tier)
  const hasDiscount = tier !== 'tier3' && discountCode !== null

  const emailData = { name, spotNumber, discountCode, discount: offer.discount, hasDiscount }

  try {
    await transporter.sendMail({
      from: `"${brand.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: getWelcomeEmailSubject(emailData),
      text: getWelcomeEmailText(emailData),
      html: getWelcomeEmailHtml(emailData),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

interface SendCreatorsEmailParams {
  name: string
  email: string
  instagramUsername: string
  status?: 'received' | 'approved' | 'rejected'
  reason?: string
}

export async function sendCreatorsEmail({ name, email, instagramUsername, status, reason }: SendCreatorsEmailParams) {
  const { brand } = siteConfig
  const emailData = { name, instagramUsername, status, reason }

  try {
    await transporter.sendMail({
      from: `"${brand.name} Creators" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: getCreatorsEmailSubject(emailData),
      text: getCreatorsEmailText(emailData),
      html: getCreatorsEmailHtml(emailData),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send creators email:', error)
    return { success: false, error }
  }
}

interface SendCreatorApplicationAlertParams {
  name: string
  email: string
  instagramUsername: string
  followerRange: string
  contentNiche: string
}

export async function sendCreatorApplicationAlert(params: SendCreatorApplicationAlertParams) {
  const { brand } = siteConfig
  const fromAddr = getSmtpFromAddress()
  const toAddr = getAdminNotificationRecipients()

  if (!fromAddr) return { success: false }

  try {
    await transporter.sendMail({
      from: `"${brand.name} Notifications" <${fromAddr}>`,
      to: toAddr,
      replyTo: params.email,
      subject: getCreatorApplicationAlertSubject(params),
      text: getCreatorApplicationAlertText(params),
      html: getCreatorApplicationAlertHtml(params),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send creator application alert:', error)
    return { success: false, error }
  }
}

interface SendPreRegistrationAlertParams {
  name: string
  email: string
  spotNumber: number
  tier: OfferTier
}

export async function sendPreRegistrationAlert(params: SendPreRegistrationAlertParams) {
  const { brand } = siteConfig
  const fromAddr = getSmtpFromAddress()
  const toAddr = getAdminNotificationRecipients()

  if (!fromAddr) return { success: false }

  try {
    await transporter.sendMail({
      from: `"${brand.name} Notifications" <${fromAddr}>`,
      to: toAddr,
      replyTo: params.email,
      subject: getPreRegistrationAlertSubject(params),
      text: getPreRegistrationAlertText(params),
      html: getPreRegistrationAlertHtml(params),
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to send preregistration alert:', error)
    return { success: false, error }
  }
}
