export type Hub = 'london' | 'seoul'

export type PostCategory = 'Travel' | 'Question' | 'Social' | 'Safety' | 'Local'
export type MeetupCategory = 'Social' | 'Culture' | 'Study' | 'Outdoors' | 'Food'
export type PlaceCategory = 'Cafe' | 'Library' | 'Park' | 'Food' | 'Shopping'

export interface Profile {
  id: string
  email: string
  name: string
  university: string
  hub: Hub
  base_hub: Hub
  avatar_url?: string
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  hub: Hub
  category: PostCategory
  title: string
  body: string
  created_at: string
  profiles?: Profile
  reply_count?: number
  liked?: boolean
}

export interface Reply {
  id: string
  post_id: string
  author_id: string
  body: string
  created_at: string
  profiles?: Profile
}

export interface Meetup {
  id: string
  creator_id: string
  hub: Hub
  name: string
  location: string
  category: MeetupCategory
  description: string
  date: string
  created_at: string
  profiles?: Profile
  attendee_count?: number
  joined?: boolean
}

export interface Place {
  id: string
  hub: Hub
  name: string
  category: PlaceCategory
  description: string
  maps_url: string
  created_at: string
  intel_notes?: IntelNote[]
  avg_rating?: number
}

export interface IntelNote {
  id: string
  place_id: string
  author_id: string
  note: string
  created_at: string
  profiles?: Profile
}
