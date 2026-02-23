"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Client initialisé à la première utilisation, mais jamais null/undefined au retour de la fonction
let client: SupabaseClient

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      throw new Error("Variables d'environnement Supabase manquantes")
    }

    client = createBrowserClient(url, anonKey)
  }

  return client
}