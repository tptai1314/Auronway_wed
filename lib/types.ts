export type EventType = "WORKSHOP" | "COMPETITION" | "SEMINAR" | "VOLUNTEER" | "TRAINING"
export type EventMode = "OFFLINE" | "ONLINE" | "HYBRID"
export type EventStatus = "DRAFT" | "APPROVED" | "CANCELLED"

export interface EventSkill {
  skill_id: string
  skill_name?: string
  xp_reward: number
}

export interface Event {
  _id: string
  title: string
  description?: string
  tenant_id: string
  campus_id: string | { _id: string; name: string }
  organizer_id: string | { _id: string; name: string }
  type: EventType
  mode: EventMode
  tags: string[]
  created_by: string
  status: EventStatus
  start_at: string
  end_at: string
  registration_open_at?: string
  registration_close_at?: string
  location?: string
  meeting_url?: string
  cover_image_url?: string
  media_urls: string[]
  skills: EventSkill[]
  registered_count: number
  attended_count: number
  createdAt: string
  updatedAt: string
}

export interface Registration {
  _id: string
  user_id: string | {
    _id: string
    email: string
    profile?: {
      full_name?: string
      avatar_url?: string
    }
  }
  event_id: string
  status: "REGISTERED" | "ATTENDED" | "CANCELLED"
  registered_at: string
  attended_at?: string
  xp_awarded: boolean
}

// Legacy Participant type for backwards compatibility
export interface Participant {
  _id: string
  user_id: string
  event_id: string
  user_name: string
  user_email: string
  user_avatar?: string
  registered_at: string
  checked_in_at?: string
  status: "REGISTERED" | "CHECKED_IN" | "CANCELLED"
}

export interface User {
  _id: string
  email: string
  profile?: {
    full_name?: string
    avatar_url?: string
    student_id?: string
    major?: string
    bio?: string
    phone?: string
  }
  roles: string[]
  affiliations?: Array<{
    tenant_id?: string
    campus_id?: string
    organizer_id?: string
    role: string
    department?: string
  }>
  stats?: {
    total_xp: number
    level: number
    completed_events: number
    certificates_count?: number
  }
  is_active: boolean
  createdAt: string
  updatedAt: string
}

export interface CheckInSession {
  event_id: string
  event_title: string
  start_time: string
  end_time: string
  qr_code: string
  is_active: boolean
}
