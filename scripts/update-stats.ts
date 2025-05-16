import { createClient } from '@supabase/supabase-js'
import { sendHomeRunEmail } from './email'

interface HittingStats {
  AB: string
  H: string
  HR: string
  RBI: string
  AVG: string
}

interface GameStats {
  Hitting: HittingStats
  team: string
}

interface PlayerStatsResponse {
  statusCode: number
  body: {
    [gameId: string]: GameStats
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function fetchPlayerStats(playerId: string = '660271', numberOfGames: number = 20): Promise<PlayerStatsResponse['body']> {
  console.log('Fetching player stats...')
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
  console.log(`Fetched ${Object.keys(data.body).length} games`)
  return data.body
}

async function updateStats() {
  try {
    // Get the ID from games-since table first
    const { data: gamesSinceRow, error: fetchError } = await supabase
      .from('games-since')
      .select('id')
      .eq('player_id', '660271')
      .single()

    if (fetchError) {
      throw fetchError
    }

    const stats = await fetchPlayerStats()
    const games = Object.entries(stats)

    const recentGames = games.slice(0, 5).map(([gameId, gameStats]) => {
      const [date, matchup] = gameId.split('_')
      const [away, home] = matchup.split('@')
      const opponent = away === gameStats.team ? home : away

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

    console.log('Recent games to update:', JSON.stringify(recentGames, null, 2))

    // Count games since last home run
    let gamesSinceLastHR = 0
    for (const [, gameStats] of games) {
      if (gameStats.Hitting.HR !== '0') break
      gamesSinceLastHR++
    }

    console.log('Games since last HR:', gamesSinceLastHR)

    // Update games_since table
    const { error: updateError } = await supabase
      .from('games-since')
      .update({
        games_since: gamesSinceLastHR,
        recent_games: recentGames,
      })
      .eq('id', gamesSinceRow.id)

    if (updateError) {
      throw updateError
    }

    console.log('Successfully updated games_since table')

    // Fetch subscribers who need to be notified
    const { data: subscribers, error: subscribersError } = await supabase
      .from('player-subscribers')
      .select('email, unsubscribe_token, limit')
      .eq('player_id', gamesSinceRow.id)
      .gte('limit', gamesSinceLastHR)

    if (subscribersError) {
      throw subscribersError
    }

    console.log(`Found ${subscribers?.length || 0} subscribers to notify (games since HR: ${gamesSinceLastHR})`)

    // Send emails to subscribers
    if (subscribers && subscribers.length > 0) {
      console.log('Starting to send emails to subscribers...')
      for (const subscriber of subscribers) {
        try {
          await sendHomeRunEmail(subscriber, gamesSinceLastHR)
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error)
          // Continue with other subscribers even if one fails
        }
      }
    }

    console.log('Successfully completed stats update')
  } catch (error) {
    console.error('Error updating stats:', error)
    process.exit(1)
  }
}

updateStats() 
