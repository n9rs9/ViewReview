"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import type { Review, Sentiment } from "@/components/dashboard/review-card"

export default function Page() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push("/login")
        return
      }
      setUser(user)

      const { data: profiles } = await supabase
        .from("profiles")
        .select("google_maps_url")
        .eq("user_id", user.id)
        .limit(1)

      if (profiles && profiles.length > 0) {
        setProfile(profiles[0])
      }

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("id, client_name, review_text, sentiment, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (reviewsData) {
        const formattedReviews: Review[] = reviewsData.map((row) => ({
          id: String(row.id),
          clientName: row.client_name ?? "Anonyme",
          clientInitials: (row.client_name ?? "??").slice(0, 2).toUpperCase(),
          text: row.review_text ?? "",
          sentiment: (row.sentiment?.toLowerCase() || "neutral") as Sentiment,
          timestamp: row.created_at
            ? formatDistanceToNow(new Date(row.created_at), { addSuffix: true, locale: fr })
            : "—",
        }))
        setReviews(formattedReviews)
      }
      
      setLoading(false)
    }

    loadDashboard()
  }, [router, supabase])

  async function handleAddShop(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const url = formData.get("url")

    // 1. Sauvegarde dans Supabase
    const { error: insertError } = await supabase.from("profiles").insert([{ 
      user_id: user.id, 
      google_maps_url: url 
    }])

    if (!insertError) {
      // 2. Appel au Webhook n8n via Ngrok
      // On utilise l'URL que tu as fournie (ajustée pour le webhook)
      try {
        await fetch("https://suellen-unwormy-ernestine.ngrok-free.dev/webhook-test/nouveau-commerce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        })
      } catch (err) {
        console.error("Erreur Webhook:", err)
      }

      // 3. Rafraîchissement pour passer à l'état "Analyse en cours"
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-lg font-medium">Chargement du Dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            
            {!profile ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 bg-card/50">
                <div className="mb-4 text-4xl">🏪</div>
                <h2 className="text-2xl font-bold tracking-tight text-center">Liez votre commerce</h2>
                <p className="mt-2 text-center text-muted-foreground max-w-sm">
                  Entrez l'URL Google Maps pour lancer l'analyse IA.
                </p>
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-sm font-medium">
                  ⚠️ Slot Unique : Un seul établissement possible.
                </div>
                
                <form onSubmit={handleAddShop} className="mt-8 flex w-full max-w-md gap-3">
                  <input 
                    name="url"
                    type="url" 
                    placeholder="Lien Google Maps..." 
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Activer
                  </button>
                </form>
              </div>
            ) : (
              <>
                <StatsBar />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Dernières Analyses
                    </h2>
                  </div>
                  
                  {reviews.length > 0 ? (
                    <ReviewGrid reviews={reviews} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 border rounded-xl bg-muted/20 text-center">
                      <div className="animate-bounce mb-4 text-3xl">🚀</div>
                      <p className="font-semibold text-foreground">Analyse initiale en cours...</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                        L'IA traite vos avis. Cela prend généralement 2 à 5 minutes.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}