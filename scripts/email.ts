import { Resend } from 'resend'

// Log key presence (not the actual key)
console.log('Resend API Key present:', !!process.env.RESEND_API_KEY)
console.log('Resend API Key length:', process.env.RESEND_API_KEY?.length)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendHomeRunEmail(email: string, gamesSince: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ohtani Tracker <Helper@gamessince.com>',
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

    console.log('Email sent successfully:', data)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
} 