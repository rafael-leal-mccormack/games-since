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
      from: 'Ohtani Home Run Tracker <notifications@gamessince.com>',
      to: subscriber.email,
      subject: `Ohtani Home Run Update: ${gamesSince} games since last HR`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #1a73e8;
              }
              .content {
                margin-bottom: 30px;
              }
              .games-count {
                font-size: 36px;
                font-weight: bold;
                color: #1a73e8;
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                font-size: 12px;
                color: #666;
                text-align: center;
                border-top: 1px solid #eee;
                padding-top: 20px;
                margin-top: 30px;
              }
              .unsubscribe {
                color: #666;
                text-decoration: none;
              }
              .unsubscribe:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">⚾️ Ohtani HR Tracker</div>
              </div>
              
              <div class="content">
                <p>Hi there! 👋</p>
                <div class="games-count">
                  ${gamesSince} Games
                </div>
                <p style="text-align: center;">since Shohei Ohtani's last home run</p>
              </div>
              
              <div class="footer">
                <p>You're receiving this email because you subscribed to Ohtani home run updates.</p>
                <p><a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe from these notifications</a></p>
              </div>
            </div>
          </body>
        </html>
      `
    })
    console.log(`Email sent successfully to ${subscriber.email}`)
  } catch (error) {
    console.error(`Error sending email to ${subscriber.email}:`, error)
  }
} 