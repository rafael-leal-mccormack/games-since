'use server'

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

export async function getPlayerStats(playerId: string = '660271', numberOfGames: number = 20) {
  const url = `https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBGamesForPlayer?playerID=${playerId}&numberOfGames=${numberOfGames}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY || '',
        'x-rapidapi-host': process.env.RAPID_API_HOST || ''
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: PlayerStatsResponse = await response.json()
    return data.body
  } catch (error) {
    console.error('Error fetching player stats:', error)
    throw new Error('Failed to fetch player stats')
  }
}
