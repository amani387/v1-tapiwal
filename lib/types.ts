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
  role: "super_admin" | "admin" | "user"
  account_type?: "individual" | "company"
  company_id?: string
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

export interface Order {
  id: string
  order_type: "individual" | "company"
  full_name: string
  email: string
  phone: string
  company_name?: string
  number_of_cards: number
  message?: string
  status: "pending" | "contacted" | "paid" | "completed" | "cancelled"| "invitation_sent"
  created_at: string
  updated_at: string
  quantity: number
}

export interface Invitation {
  id: string
  code: string
  email: string
  order_id?: string
  account_type: "individual" | "company"
  number_of_cards: number
  used: boolean
  used_by?: string
  used_at?: string
  expires_at: string
  created_by?: string
  created_at: string
}

export interface Company {
  id: string
  name: string
  logo_url?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  admin_user_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  company_id: string
  user_id?: string
  full_name: string
  email: string
  phone?: string
  title?: string
  bio?: string
  profile_image_url?: string
  unique_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  admin_id: string
  action: string
  target_user_id?: string
  details?: Record<string, any>
  created_at: string
}
