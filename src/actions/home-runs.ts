'use server'

import { getPlayerStats } from './player-stats'

interface HomeRunStats {
  lastHomeRun: {
    gameId: string
    date: string
    opponent: string
    stats: {
      AB: string
      H: string
      HR: string
      RBI: string
      AVG: string
    }
  } | null
  gamesSinceLastHR: number
  recentGames: Array<{
    gameId: string
    date: string
    opponent: string
    stats: {
      AB: string
      H: string
      HR: string
      RBI: string
      AVG: string
    }
  }>
}

export async function getHomeRunStats(playerId: string = '660271', numberOfGames: number = 20): Promise<HomeRunStats> {
  const stats = await getPlayerStats(playerId, numberOfGames)
  const games = Object.entries(stats)
  let lastHomeRun = null
  let gamesSinceLastHR = 0

  for (const [gameId, gameStats] of games) {
    if (gameStats.Hitting.HR !== '0') {
      const [date, matchup] = gameId.split('_')
      const [away, home] = matchup.split('@')
      const opponent = gameStats.team === 'LAD' ? away : home

      lastHomeRun = {
        gameId,
        date,
        opponent,
        stats: {
          AB: gameStats.Hitting.AB,
          H: gameStats.Hitting.H,
          HR: gameStats.Hitting.HR,
          RBI: gameStats.Hitting.RBI,
          AVG: gameStats.Hitting.AVG
        }
      }
      break
    }
    gamesSinceLastHR++
  }

  return {
    lastHomeRun,
    gamesSinceLastHR,
    recentGames: games.slice(0, 5).map(([gameId, gameStats]) => {
      const [date, matchup] = gameId.split('_')
      const [away, home] = matchup.split('@')
      const opponent = gameStats.team === 'LAD' ? away : home

      return {
        gameId,
        date,
        opponent,
        stats: {
          AB: gameStats.Hitting.AB,
          H: gameStats.Hitting.H,
          HR: gameStats.Hitting.HR,
          RBI: gameStats.Hitting.RBI,
          AVG: gameStats.Hitting.AVG
        }
      }
    })
  }
}
