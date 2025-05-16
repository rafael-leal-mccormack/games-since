import { HomeRunCounter } from "@/components/HomeRunCounter"
import { RecentGames } from "@/components/RecentGames"
import { NotificationForm } from "@/components/NotificationForm"
import { getGamesSince, getRecentGames } from "@/lib/supabase/queries"
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const gamesSince = await getGamesSince()
  
  const title = `${gamesSince?.games_since || '0'} Games Since Ohtani's Last HR`
  const description = "Track how many games it has been since Shohei Ohtani's last home run"
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{
        url: `/api/og?games=${gamesSince?.games_since || '0'}`,
        width: 1200,
        height: 630,
        alt: title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?games=${gamesSince?.games_since || '0'}`],
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
    <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-slate-800 text-white">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-sky-300">Shohei Ohtani</h1>

        <HomeRunCounter 
          gamesSince={gamesSince.games_since} 
          lastUpdated={gamesSince.created_at} 
        />

        <RecentGames games={recentGames} />

        <NotificationForm />
      </div>

      <footer className="mt-16 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} Lit Solutions LLC</p>
        <p className="text-xs mt-1">Not affiliated with MLB or Shohei Ohtani</p>
      </footer>
    </div>
  )
}
