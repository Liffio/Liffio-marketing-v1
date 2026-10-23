interface HelpContactData {
  name: string
  email: string
  subject: string
  message: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function getHelpContactSubject({ subject }: HelpContactData): string {
  return `Help request: ${subject}`
}

export function getHelpContactText(data: HelpContactData): string {
  return `
New help request from the Liffio help center.

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
`.trim()
}

export function getHelpContactHtml(data: HelpContactData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New help request</title></head>
<body style="margin:0;padding:24px;background:#F8FAFC;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;border-radius:14px;">
    <tr><td style="padding:28px;">
      <p style="margin:0 0 10px;font-size:12px;color:#f5184c;font-weight:700;letter-spacing:.08em;">HELP CENTER</p>
      <h1 style="margin:0 0 14px;font-size:24px;color:#0F172A;">New help request</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #E2E8F0;border-radius:10px;">
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Name:</strong> ${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Email:</strong> ${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:12px 14px;border-bottom:1px solid #E2E8F0;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</td></tr>
        <tr><td style="padding:12px 14px;white-space:pre-wrap;"><strong>Message:</strong><br>${escapeHtml(data.message)}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim()
}
