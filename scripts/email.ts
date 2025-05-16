import { Resend } from 'resend'

// Log key presence (not the actual key)
console.log('Resend API Key present:', !!process.env.RESEND_API_KEY)
console.log('Resend API Key length:', process.env.RESEND_API_KEY?.length)

interface Subscriber {
  email: string
  unsubscribe_token: string
}

export async function sendHomeRunEmail(subscriber: Subscriber, gamesSince: number) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?token=${subscriber.unsubscribe_token}`
    
    await resend.emails.send({
      from: 'Ohtani Home Run Tracker <updates@ohtani-tracker.com>',
      to: subscriber.email,
      subject: `Ohtani Home Run Update: ${gamesSince} games since last HR`,
      html: `
        <p>Hi there!</p>
        <p>It has been ${gamesSince} games since Shohei Ohtani's last home run.</p>
        <br/>
        <p>You are receiving this email because you subscribed to Ohtani home run updates.</p>
        <p><a href="${unsubscribeUrl}">Click here to unsubscribe</a></p>
      `
    })
    console.log(`Email sent successfully to ${subscriber.email}`)
    return true
  } catch (error) {
    console.error(`Error sending email to ${subscriber.email}:`, error)
    return false
  }
} 