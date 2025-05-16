export interface GamesSince {
  id: string
  created_at: string
  player: string
  stat: string
  player_id: string
  games_since: number
}

export interface Game {
  id: string
  created_at: string
  player_id: string
  game_id: string
  date: string
  opponent: string
  ab: number
  h: number
  hr: number
  rbi: number
  avg: string
} 