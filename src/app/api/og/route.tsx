import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const games = searchParams.get('games') || '0'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f5f5dc', // Beige background like in the image
            padding: '40px 80px',
          }}
        >
          {/* Left side with image */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            height: '100%',
          }}>
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/homerun-logo.png`}
              alt="Home Run"
              width="450"
              height="450"
              style={{
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Right side with text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '50%',
            }}
          >
            <h1 style={{ 
              fontSize: 72, 
              color: '#0a2342', // Dark navy like in the image
              margin: 0,
              lineHeight: 1.2,
              fontWeight: 'bold',
            }}>
              GAMES SINCE
            </h1>
            <h2 style={{ 
              fontSize: 72,
              color: '#0a2342',
              margin: '0 0 20px 0',
              fontWeight: 'bold',
            }}>
              LAST HR
            </h2>
            <div style={{ 
              fontSize: 144,
              fontWeight: 'bold',
              color: '#ff6b35', // Orange like in the image
              margin: '20px 0',
              lineHeight: 1,
            }}>
              {games}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    } else {
      console.log('An unknown error occurred')
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
} 