import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getGamesSince, getRecentGames } from "@/lib/supabase/queries"

function formatDate(dateStr: string, format: 'long' | 'short' = 'long') {
  const [year, month, day] = dateStr.match(/(\d{4})(\d{2})(\d{2})/)?.slice(1) || []
  const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0))
  
  return date.toLocaleDateString('en-US', {
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: format === 'long' ? 'numeric' : undefined
  })
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

        <Card className="w-full bg-slate-700 border-slate-600">
          <CardContent className="p-8 flex flex-col items-center">
            <h2 className="text-xl text-slate-300 mb-4">Games Since Last Home Run</h2>
            <div className="text-7xl md:text-9xl font-bold text-sky-300">{gamesSince.games_since}</div>
            <p className="text-slate-300 mt-4">
              Last updated: {new Date(gamesSince.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full bg-slate-700 border-slate-600">
          <CardContent className="p-6">
            <h3 className="text-lg text-slate-300 mb-4">Recent Games</h3>
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div 
                  key={game.game_id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-600/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">{formatDate(game.date, 'short')}</span>
                    <span className="text-sky-300">vs {game.opponent}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-300">
                      {game.ab} AB, {game.h} H
                    </span>
                    {game.hr > 0 && (
                      <span className="text-yellow-400 font-medium">
                        {game.hr} HR
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="w-full max-w-md">
          <h3 className="text-xl font-medium mb-4 text-center text-sky-200">Get HR Notifications</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button type="submit" className="gap-2 bg-sky-500 hover:bg-sky-600">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Subscribe</span>
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            We&apos;ll notify you whenever Shohei hits another home run!
          </p>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} Ohtani Tracker</p>
        <p className="text-xs mt-1">Not affiliated with MLB or Shohei Ohtani</p>
      </footer>
    </div>
  )
}
