'use server'

import { createClient } from '@/lib/supabase.server'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function addSubscriber(formData: FormData) {
  const email = formData.get('email') as string
  const limit = parseInt(formData.get('limit') as string)

  if (!email || !limit) {
    return { error: 'Email and limit are required' }
  }

  try {
    const supabase = await createClient()

    // Get Ohtani's ID from games-since table
    const { data: gamesSince, error: playerError } = await supabase
      .from('games-since')
      .select('id')
      .eq('player_id', '660271')
      .single()

    if (playerError) {
      console.error('Error fetching player ID:', playerError)
      return { error: 'Failed to fetch player data' }
    }

    const unsubscribe_token = generateToken()

    const { error } = await supabase
      .from('player-subscribers')
      .upsert(
        {
          email,
          limit,
          player_id: gamesSince.id,
          unsubscribe_token
        },
        {
          onConflict: 'email,player_id'
        }
      )

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error adding subscriber:', error)
    return { error: 'Failed to add subscriber' }
  }
} 