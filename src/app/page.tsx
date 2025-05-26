import { HomeRunCounter } from "@/components/HomeRunCounter"
import { RecentGames } from "@/components/RecentGames"
import { NotificationForm } from "@/components/NotificationForm"
import { getGamesSince, getRecentGames } from "@/lib/supabase/queries"
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const gamesSince = await getGamesSince()
  
  const title = `${gamesSince?.games_since || '0'} Games Since Ohtani's Last HR`
  const description = `Track Shohei Ohtani's home run streak with the Dodgers. It's been ${gamesSince?.games_since || '0'} games since his last home run. Get live updates and notifications.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Ohtani HR Tracker',
      locale: 'en_US',
      images: [{
        url: `/api/og?games=${gamesSince?.games_since || '0'}`,
        width: 1200,
        height: 630,
        alt: title
      }]
    },
   
  }
}

// Add JSON-LD structured data
function generateStructuredData(gamesSince: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Shohei Ohtani Home Run Tracker',
    description: `Track Shohei Ohtani's home runs. ${gamesSince} games since last home run.`,
    athlete: {
      '@type': 'Person',
      name: 'Shohei Ohtani',
      affiliation: {
        '@type': 'SportsTeam',
        name: 'Los Angeles Dodgers'
      }
    },
    sport: 'Baseball',
    gameLocation: {
      '@type': 'StadiumOrArena',
      name: 'Dodger Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Los Angeles',
        addressRegion: 'CA',
        addressCountry: 'US'
      }
    }
  }
}

export default async function Home() {
  const [gamesSince, recentGames] = await Promise.all([
    getGamesSince(),
    getRecentGames()
  ])

  if (!gamesSince) {
    return <div>Issue loading stats</div>
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(gamesSince.games_since))
        }}
      />
      <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-slate-800 text-white">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-sky-300">Shohei Ohtani</h1>

          <HomeRunCounter 
            gamesSince={gamesSince.games_since} 
            lastUpdated={gamesSince.recent_games[0].date} 
          />

          <RecentGames games={recentGames} />

          <NotificationForm />
        </div>

        <footer className="mt-16 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Lit Solutions LLC</p>
          <p className="text-xs mt-1">Not affiliated with MLB or Shohei Ohtani</p>
        </footer>
      </div>
    </>
  )
}
