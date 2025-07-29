
import type { Trend, ViralScoreBreakdown } from "../types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          agency_owner_id: string
          name: string
          email: string
          status: "Active" | "Pending" | "Inactive"
          created_at: string
          avatar: string | null
        }
        Insert: {
          id?: string
          agency_owner_id: string
          name: string
          email: string
          status: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar?: string | null
        }
        Update: {
          id?: string
          agency_owner_id?: string
          name?: string
          email?: string
          status?: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar?: string | null
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          primary_niche: string | null
          platforms: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
        }
      }
      scripts: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          title: string
          hook: string
          script: string
          tone: string
          viral_score_breakdown: Json | null
          visuals: string[] | null
          niche: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          title: string
          hook: string
          script: string
          tone: string
          viral_score_breakdown?: Json | null
          visuals?: string[] | null
          niche?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          folder_id?: string | null
          title?: string
          hook?: string
          script?: string
          tone?: string
          viral_score_breakdown?: Json | null
          visuals?: string[] | null
          niche?: string | null
          created_at?: string
        }
      }
      watched_trends: {
        Row: {
          id: string
          user_id: string
          trend_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trend_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trend_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
