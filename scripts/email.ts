import { Resend } from 'resend'

// Log key presence (not the actual key)
console.log('Resend API Key present:', !!process.env.RESEND_API_KEY)
console.log('Resend API Key length:', process.env.RESEND_API_KEY?.length)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendHomeRunEmail(email: string, gamesSince: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ohtani Tracker <notifications@gamessince.com>',
      to: email,
      subject: `${gamesSince} Games Since Ohtani's Last HR`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ohtani Home Run Update</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #1e293b; padding: 32px; border-radius: 12px; margin-bottom: 24px;">
                <h1 style="margin: 0; color: #0ea5e9; text-align: center; font-size: 24px; font-weight: bold;">
                  Shohei Ohtani Update
                </h1>
                <div style="margin-top: 24px; text-align: center;">
                  <div style="font-size: 72px; font-weight: bold; color: #0ea5e9;">
                    ${gamesSince}
                  </div>
                  <div style="color: #94a3b8; margin-top: 8px; font-size: 18px;">
                    Games Since Last Home Run
                  </div>
                </div>
              </div>
              
              <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <p style="margin: 0; color: #e2e8f0; line-height: 1.6;">
                  Stay up to date with Shohei's home run chase! Visit <a href="https://gamessince.com" style="color: #0ea5e9; text-decoration: none;">gamessince.com</a> for the latest stats and updates.
                </p>
              </div>

              <div style="text-align: center; color: #64748b; font-size: 14px;">
                <p style="margin: 0 0 8px;">
                  You're receiving this because you subscribed to Ohtani HR notifications.
                </p>
                <p style="margin: 0;">
                  <a href="https://gamessince.com" style="color: #0ea5e9; text-decoration: none;">Visit Website</a>
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  <a href="https://gamessince.com/unsubscribe" style="color: #0ea5e9; text-decoration: none;">Unsubscribe</a>
                </p>
              </div>
            </div>
          </body>
        </html>
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