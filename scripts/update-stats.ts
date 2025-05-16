import { createClient } from "@/lib/supabase.server"

interface PitchingStats {
  BB: string
  Balk: string
  'Wild Pitch': string
  Flyouts: string
  decision: string
  'Inherited Runners': string
  H: string
  HR: string
  ER: string
  Strikes: string
  'Inherited Runners Scored': string
  Groundouts: string
  R: string
  pitchingOrder: string
  ERA: string
  HBP: string
  InningsPitched: string
  'Batters Faced': string
  SO: string
  Pitches: string
}

interface HittingStats {
  BB: string
  AB: string
  battingOrder: string
  IBB: string
  H: string
  HR: string
  substitutionOrder: string
  TB: string
  '3B': string
  GIDP: string
  '2B': string
  R: string
  SF: string
  SAC: string
  HBP: string
  RBI: string
  SO: string
  AVG: string
}

interface GameStats {
  Pitching: PitchingStats
  Hitting: HittingStats
  startingPosition: string
  allPositionsPlayed: string
  started: string
  teamID: string
  team: string
  gameID: string
}

interface PlayerStatsResponse {
  statusCode: number
  body: {
    [gameId: string]: GameStats
  }
}

interface RecentGame {
  game_id: string
  date: string
  opponent: string
  ab: number
  h: number
  hr: number
  rbi: number
  avg: string
}


async function fetchPlayerStats(playerId: string = '660271', numberOfGames: number = 20) {
  const url = `https://${process.env.RAPID_API_HOST}/getMLBGamesForPlayer?playerID=${playerId}&numberOfGames=${numberOfGames}`
  
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY!,
      'x-rapidapi-host': process.env.RAPID_API_HOST!
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: PlayerStatsResponse = await response.json()
  return data.body
}

async function updateStats() {
  try {
    const stats = await fetchPlayerStats()
    const games = Object.entries(stats)
    let gamesSinceLastHR = 0

    // Count games since last home run and prepare recent games
    const recentGames: RecentGame[] = games.slice(0, 5).map(([gameId, gameStats]) => {
      const [date, matchup] = gameId.split('_')
      const [away, home] = matchup.split('@')
      const opponent = gameStats.team === 'LAD' ? away : home

      return {
        game_id: gameId,
        date,
        opponent,
        ab: parseInt(gameStats.Hitting.AB),
        h: parseInt(gameStats.Hitting.H),
        hr: parseInt(gameStats.Hitting.HR),
        rbi: parseInt(gameStats.Hitting.RBI),
        avg: gameStats.Hitting.AVG
      }
    })

    // Count games since last home run
    for (const [, gameStats] of games) {
      if (gameStats.Hitting.HR !== '0') {
        break
      }
      gamesSinceLastHR++
    }
    
    const supabase = await createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    // Update games-since table with both games_since and recent_games
    const { error } = await supabase
      .from('games-since')
      .update({ 
        games_since: gamesSinceLastHR,
        recent_games: recentGames
      })
      .eq('player_id', '660271')
      .eq('stat', 'home_run')

    if (error) {
      throw error
    }

    console.log('Stats updated successfully')
  } catch (error) {
    console.error('Error updating stats:', error)
    process.exit(1)
  }
}

updateStats() 