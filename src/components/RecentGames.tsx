import { Card, CardContent } from "@/components/ui/card"

interface Game {
  game_id: string
  date: string
  opponent: string
  ab: number
  h: number
  hr: number
  rbi: number
  avg: string
}

interface RecentGamesProps {
  games: Game[]
}

function formatDate(dateStr: string, format: 'long' | 'short' = 'long') {
  const [year, month, day] = dateStr.match(/(\d{4})(\d{2})(\d{2})/)?.slice(1) || []
  const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0))
  
  return date.toLocaleDateString('en-US', {
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
    year: format === 'long' ? 'numeric' : undefined
  })
}

export function RecentGames({ games }: RecentGamesProps) {
  return (
    <Card className="w-full bg-slate-700 border-slate-600">
      <CardContent className="p-6">
        <h3 className="text-lg text-slate-300 mb-4">Recent Games</h3>
        <div className="space-y-3">
          {games.map((game) => (
            <div 
              key={game.game_id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-600/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">{formatDate(game.date, 'short')}</span>
                <span className="text-sky-300">vs {game.opponent}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-slate-300">{game.ab} AB</span>
                <span className="text-slate-300">{game.h} H</span>
                <span className={`font-medium ${game.hr > 0 ? 'text-yellow-400' : 'text-slate-300'}`}>
                  {game.hr} HR
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 