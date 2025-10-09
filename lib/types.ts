export interface User {
  id: string
  unique_id: string
  full_name: string
  email: string
  phone?: string
  company?: string
  job_title?: string
  bio?: string
  profile_image_url?: string
  cover_image_url?: string
  location?: string
  website?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  user_id: string
  platform: string
  url: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Analytics {
  id: string
  user_id: string
  tap_date: string
  tap_count: number
  unique_visitors: number
  created_at: string
  updated_at: string
}

export interface ProfileView {
  id: string
  user_id: string
  viewer_ip?: string
  viewer_user_agent?: string
  referrer?: string
  viewed_at: string
}

export type SocialPlatform =
  | "linkedin"
  | "instagram"
  | "twitter"
  | "facebook"
  | "github"
  | "tiktok"
  | "youtube"
  | "website"
  | "whatsapp"
  | "telegram"
  | "other"
