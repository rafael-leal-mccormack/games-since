import { Resend } from 'resend'

// Log key presence (not the actual key)
console.log('Resend API Key present:', !!process.env.RESEND_API_KEY)
console.log('Resend API Key length:', process.env.RESEND_API_KEY?.length)

export async function sendHomeRunEmail(email: string, gamesSince: number) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Ohtani Home Run Tracker <updates@ohtani-tracker.com>',
      to: email,
      subject: `Ohtani Home Run Update: ${gamesSince} games since last HR`,
      html: `
        <p>Hi there!</p>
        <p>It has been ${gamesSince} games since Shohei Ohtani's last home run.</p>
        <br/>
        <p>You are receiving this email because you subscribed to Ohtani home run updates.</p>
        <p>To unsubscribe, visit our website.</p>
      `
    })
    console.log(`Email sent to ${email}`)
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error)
  }
} 