import { SupabaseClient } from '@supabase/supabase-js'

export function normalizeParticipants(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a]
}

export async function getOrCreateConversation(
  supabase: SupabaseClient,
  currentUserId: string,
  otherUserId: string
): Promise<string | null> {
  const [p1, p2] = normalizeParticipants(currentUserId, otherUserId)

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p1)
    .eq('participant_2', p2)
    .single()

  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ participant_1: p1, participant_2: p2 })
    .select('id')
    .single()

  if (error) return null
  return created.id
}
