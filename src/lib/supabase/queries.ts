import { createClient } from '../supabase.server'
import { GamesSince, Game } from './types'

export async function getGamesSince(playerId: string = '660271'): Promise<GamesSince | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('games-since')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.log('Error fetching games since:', error)
    return null
  }

  return data as GamesSince
}

export async function getRecentGames(playerId: string = '660271'): Promise<Game[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('games-since')
    .select('recent_games')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.log('Error fetching recent games:', error)
    return []
  }

  return (data?.recent_games || []) as Game[]
} 