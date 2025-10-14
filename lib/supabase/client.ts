import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  console.log("Creating browser client with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Creating browser client with ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return createSupabaseBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function createClient() {
  return createSupabaseBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
