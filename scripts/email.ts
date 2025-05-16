import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendHomeRunEmail(email: string, gamesSince: number) {
  const { error } = await resend.emails.send({
    from: 'Ohtani Tracker <tracker@yourdomain.com>',
    to: email,
    subject: `Shohei Ohtani: ${gamesSince} Games Since Last Home Run`,
    html: `
      <h1>Shohei Ohtani Home Run Update</h1>
      <p>It has been ${gamesSince} games since Shohei Ohtani's last home run.</p>
      <p>Stay tuned for more updates!</p>
    `
  })

  if (error) {
    console.error('Error sending email:', error)
    return false
  }

  return true
} 