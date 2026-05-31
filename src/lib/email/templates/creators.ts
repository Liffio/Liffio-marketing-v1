import { siteConfig } from '@/config/site.config'

interface CreatorsEmailData {
  name: string
  instagramUsername: string
  status?: 'received' | 'approved' | 'rejected'
  reason?: string
}

function normalizeStatus(status: CreatorsEmailData['status']): 'received' | 'approved' | 'rejected' {
  return status || 'received'
}

export function getCreatorsEmailSubject({ name, status }: CreatorsEmailData): string {
  const resolvedStatus = normalizeStatus(status)
  if (resolvedStatus === 'approved') return `🎉 ${name}, welcome to the ${siteConfig.brand.name} Creators Program`
  if (resolvedStatus === 'rejected') return `${siteConfig.brand.name} Creators Program application update`
  return `🎯 ${name}, your Creators Program application is received!`
}

export function getCreatorsEmailText({ name, instagramUsername, status, reason }: CreatorsEmailData): string {
  const { brand } = siteConfig
  const resolvedStatus = normalizeStatus(status)

  if (resolvedStatus === 'approved') {
    return `
Hi ${name},

Great news - your Creators Program application for @${instagramUsername} has been approved.

What happens next:
- Our onboarding team will contact you with setup instructions
- You will get full Business plan access after onboarding
- You can reply to this email if you want to share context before onboarding

${reason?.trim() ? `Additional note from our team:\n${reason.trim()}\n` : ''}
Questions? Reply to this email - we read every message.

© ${new Date().getFullYear()} ${brand.name}
`.trim()
  }

  if (resolvedStatus === 'rejected') {
    return `
Hi ${name},

Thank you for applying to the ${brand.name} Creators Program for @${instagramUsername}.

After review, we are unable to approve this application right now.

Reason:
${reason?.trim() || 'Your current profile does not match the acceptance criteria at this time.'}

You are welcome to improve your profile and apply again in the future.

Questions? Reply to this email - we read every message.

© ${new Date().getFullYear()} ${brand.name}
`.trim()
  }

  return `
Welcome to the ${brand.name} Creators Program, ${name}!

We've received your application for @${instagramUsername} and we're excited to review it.

WHAT YOU GET (IF APPROVED):
- Full Business plan access (value $79/month)
- Unlimited comment-to-DM automations
- Advanced analytics & conversion tracking
- DM follow-up sequences
- Priority support

WHAT WE ASK:
- Send at least 300 automated DMs per month
- Run at least 2 automation campaigns every 30 days
- Keep the "Powered by ${brand.name}" footer on your bio link page

WHAT HAPPENS NEXT?
Our team will review your application within 48-72 hours.

We'll email you once a decision is made.

Questions? Reply to this email — we read every message.

© ${new Date().getFullYear()} ${brand.name}
`.trim()
}

export function getCreatorsEmailHtml({ name, instagramUsername, status, reason }: CreatorsEmailData): string {
  const { brand } = siteConfig
  const resolvedStatus = normalizeStatus(status)

  if (resolvedStatus === 'approved') {
    return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${brand.name} Creators Program - Approved</title></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F9FAFB;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #E5E7EB;border-radius:16px;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:.08em;color:#16A34A;font-weight:700;">CREATORS PROGRAM</p>
          <h1 style="margin:0 0 16px 0;font-size:28px;color:#111827;">Welcome aboard, ${name}! ✅</h1>
          <p style="margin:0 0 12px 0;color:#374151;line-height:1.6;">Your application for <strong>@${instagramUsername}</strong> has been approved.</p>
          <div style="margin:18px 0 0;padding:14px;border:1px solid #DCFCE7;background:#F0FDF4;border-radius:10px;">
            <p style="margin:0 0 8px 0;font-size:12px;color:#166534;font-weight:700;letter-spacing:.06em;">WHAT HAPPENS NEXT</p>
            <ul style="margin:0;padding-left:18px;color:#14532D;line-height:1.6;">
              <li>Our team sends onboarding instructions shortly</li>
              <li>You receive full Business plan access after onboarding</li>
              <li>Reply to this email if you have onboarding questions</li>
            </ul>
          </div>
          ${reason?.trim() ? `<div style="margin-top:20px;padding:14px;border:1px solid #DCFCE7;background:#F0FDF4;border-radius:10px;"><p style="margin:0 0 8px 0;font-size:12px;color:#166534;font-weight:700;letter-spacing:.06em;">NOTE FROM TEAM</p><p style="margin:0;color:#14532D;line-height:1.6;">${reason.trim()}</p></div>` : ''}
          <p style="margin:24px 0 0 0;color:#6B7280;font-size:14px;">Questions? Reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim()
  }

  if (resolvedStatus === 'rejected') {
    return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${brand.name} Creators Program - Application Update</title></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F9FAFB;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #E5E7EB;border-radius:16px;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:.08em;color:#DC2626;font-weight:700;">APPLICATION UPDATE</p>
          <h1 style="margin:0 0 16px 0;font-size:28px;color:#111827;">Thank you for applying, ${name}</h1>
          <p style="margin:0 0 12px 0;color:#374151;line-height:1.6;">We reviewed your application for <strong>@${instagramUsername}</strong> and are unable to approve it at this time.</p>
          <div style="margin-top:20px;padding:14px;border:1px solid #FECACA;background:#FEF2F2;border-radius:10px;">
            <p style="margin:0 0 8px 0;font-size:12px;color:#991B1B;font-weight:700;letter-spacing:.06em;">REASON</p>
            <p style="margin:0;color:#7F1D1D;line-height:1.6;">${reason?.trim() || 'Your current profile does not match the acceptance criteria at this time.'}</p>
          </div>
          <p style="margin:20px 0 0 0;color:#4B5563;line-height:1.6;">You are welcome to improve your profile and apply again in the future.</p>
          <p style="margin:24px 0 0 0;color:#6B7280;font-size:14px;">Questions? Reply to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim()
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to ${brand.name} Creators Program</title></head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB;">
    <tr><td align="center" style="padding: 60px 20px;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td align="center" style="padding-bottom: 40px;">
            <table role="presentation" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td style="background: linear-gradient(135deg, #7c5af3 0%, #4259f0 100%); width: 40px; height: 40px; border-radius: 12px; text-align: center; vertical-align: middle;">
                  <span style="color: #ffffff; font-size: 18px; font-weight: 800; font-family: sans-serif;">L</span>
                </td>
                <td style="padding-left: 12px; font-family: sans-serif; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">${brand.name}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 24px; padding: 60px 48px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr><td align="center" style="padding-bottom: 24px;">
                <span style="display: inline-block; background-color: #f3f0ff; color: #4259f0; font-family: sans-serif; font-size: 11px; font-weight: 700; padding: 8px 20px; border-radius: 100px; letter-spacing: 0.08em; border: 1px solid #bfb0fb;">🎯 APPLICATION RECEIVED</span>
              </td></tr>
            </table>
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr><td align="center" style="padding-bottom: 20px;">
                <h1 style="margin: 0; font-family: sans-serif; font-size: 36px; font-weight: 800; color: #111827; line-height: 1.1; letter-spacing: -0.03em;">Hey ${name}! 👋</h1>
              </td></tr>
              <tr><td align="center" style="padding-bottom: 32px;">
                <p style="margin: 0; font-family: sans-serif; font-size: 17px; color: #4B5563; line-height: 1.6;">We've received your application for <strong style="color: #4259f0;">@${instagramUsername}</strong> and our team is excited to review your profile.</p>
              </td></tr>
            </table>
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 20px; padding: 32px;">
              <tr><td style="padding-bottom: 20px;">
                <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #4259f0; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">WHAT YOU GET (IF APPROVED)</p>
              </td></tr>
              <tr><td>
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr><td style="padding: 8px 0; font-family: sans-serif; font-size: 15px; color: #1E293B;"><span style="color: #22C55E; margin-right: 12px; font-weight: bold;">✓</span> Full Business plan access ($79/mo value)</td></tr>
                  <tr><td style="padding: 8px 0; font-family: sans-serif; font-size: 15px; color: #1E293B;"><span style="color: #22C55E; margin-right: 12px; font-weight: bold;">✓</span> Unlimited comment-to-DM automations</td></tr>
                  <tr><td style="padding: 8px 0; font-family: sans-serif; font-size: 15px; color: #1E293B;"><span style="color: #22C55E; margin-right: 12px; font-weight: bold;">✓</span> Advanced analytics & conversion tracking</td></tr>
                  <tr><td style="padding: 8px 0; font-family: sans-serif; font-size: 15px; color: #1E293B;"><span style="color: #22C55E; margin-right: 12px; font-weight: bold;">✓</span> Priority onboarding & support</td></tr>
                </table>
              </td></tr>
            </table>
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px; background-color: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 16px; padding: 24px;">
              <tr><td>
                <h3 style="margin: 0 0 8px 0; font-family: sans-serif; font-size: 14px; font-weight: 700; color: #111827;">What's next?</h3>
                <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #6B7280; line-height: 1.6;">Our team manually reviews every application within <strong style="color: #111827;">48-72 hours</strong>. We'll email you once a decision is made.</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top: 40px;">
            <p style="margin: 0 0 12px 0; font-family: sans-serif; font-size: 14px; color: #6B7280;">Have questions? Just reply to this email.</p>
            <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.1em;">© ${new Date().getFullYear()} ${brand.name} • Creators Program</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim()
}
