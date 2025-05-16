import { createClient } from '@/lib/supabase.server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return new NextResponse('Invalid unsubscribe link', { status: 400 })
  }

  try {
    const supabase = await createClient()

    // First get the subscriber's email for the confirmation message
    const { data: subscriber, error: fetchError } = await supabase
      .from('player-subscribers')
      .select('email')
      .eq('unsubscribe_token', token)
      .single()

    if (fetchError || !subscriber) {
      return new NextResponse('Invalid or expired unsubscribe link', { status: 400 })
    }

    // Delete the subscription
    const { error: deleteError } = await supabase
      .from('player-subscribers')
      .delete()
      .eq('unsubscribe_token', token)

    if (deleteError) {
      throw deleteError
    }

    // Return a simple HTML page confirming the unsubscription
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1a1a1a;
            }
            .container {
              background: #f5f5f5;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
            }
            h1 { color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Successfully Unsubscribed</h1>
            <p>The email address ${subscriber.email} has been unsubscribed from Ohtani home run notifications.</p>
            <p>If you change your mind, you can always subscribe again from our website.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return new NextResponse('Error processing unsubscribe request', { status: 500 })
  }
} 