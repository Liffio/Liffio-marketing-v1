import { siteConfig } from '@/config/site.config'

interface PreRegistrationAlertData {
  name: string
  email: string
  spotNumber: number
  tier: 'tier1' | 'tier2' | 'tier3'
}

const registrationsUrl = 'https://liffio.com/dashboard/registrations'

export function getPreRegistrationAlertSubject({ name, spotNumber }: PreRegistrationAlertData): string {
  return `New preregistration: ${name} (spot #${spotNumber})`
}

export function getPreRegistrationAlertText(data: PreRegistrationAlertData): string {
  const { brand } = siteConfig
  return `
New preregistration received on ${brand.name}.

Name: ${data.name}
Email: ${data.email}
Spot number: #${data.spotNumber}
Offer tier: ${data.tier}

Review in dashboard:
${registrationsUrl}
`.trim()
}

export function getPreRegistrationAlertHtml(data: PreRegistrationAlertData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New preregistration</title></head>
<body style="margin:0;padding:24px;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;border-radius:14px;">
    <tr><td style="padding:28px;">
      <p style="margin:0 0 10px;font-size:12px;color:#f5184c;font-weight:700;letter-spacing:.08em;">ADMIN ALERT</p>
      <h1 style="margin:0 0 14px;font-size:24px;color:#0F172A;">New preregistration submitted</h1>
      <p style="margin:0 0 18px;color:#475569;line-height:1.6;">A new user has joined the waitlist.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E2E8F0;border-radius:10px;">
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Name:</strong> ${data.name}</td></tr>
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Email:</strong> ${data.email}</td></tr>
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Spot number:</strong> #${data.spotNumber}</td></tr>
        <tr><td style="padding:12px 14px;"><strong>Offer tier:</strong> ${data.tier}</td></tr>
      </table>
      <p style="margin:22px 0 0;">
        <a href="${registrationsUrl}" style="display:inline-block;background:#f5184c;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">Open registrations dashboard</a>
      </p>
    </td></tr>
  </table>
</body></html>`.trim()
}
