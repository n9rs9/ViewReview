import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { redirect } from "next/navigation" // Import crucial pour la redirection propre
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import { supabase } from "@/lib/supabase"
import type { Review, Sentiment } from "@/components/dashboard/review-card"

export const dynamic = "force-dynamic"

// Initiales pour l'avatar
function getInitials(name: string): string {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Normalisation du sentiment pour le composant UI
function normalizeSentiment(value: unknown): Sentiment {
  const s = String(value ?? "").toLowerCase()
  if (s === "positive" || s === "neutral" || s === "negative") return s
  return "neutral"
}

export default async function Page() {
  // 1. Vérification de la session côté Serveur
  const { data: { session } } = await supabase.auth.getSession()
  
  // Si pas de session, redirection immédiate vers /login
  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id

  // 2. Vérification si l'utilisateur a déjà configuré son commerce (Profiles)
  const { data: profile } = await supabase
    .from("profiles")
    .select("google_maps_url")
    .eq("user_id", userId)
    .single()

  // 3. Récupération des avis associés à cet utilisateur spécifique
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("id, client_name, review_text, sentiment, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  const reviews: Review[] = (reviewsData ?? []).map((row) => ({
    id: String(row.id),
    clientName: row.client_name ?? "Anonyme",
    clientInitials: getInitials(row.client_name ?? ""),
    text: row.review_text ?? "",
    sentiment: normalizeSentiment(row.sentiment),
    timestamp: row.created_at
      ? formatDistanceToNow(new Date(row.created_at), { addSuffix: true, locale: fr })
      : "—",
  }))

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            
            {!profile ? (
              /* ÉTAT : Premier passage - Formulaire de lien Google Maps */
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 transition-all bg-card/50">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                  🏪
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Liez votre commerce</h2>
                <p className="mt-2 text-center text-muted-foreground max-w-sm">
                  Entrez l'URL Google Maps pour que l'IA commence à analyser vos avis.
                </p>
                <div className="mt-6 w-full max-w-md p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 text-sm font-medium">
                  ⚠️ Slot Unique : Vous ne pouvez suivre qu'un seul établissement. Ce choix ne pourra pas être modifié par la suite.
                </div>
                
                <form action={async (formData) => {
                  "use server"
                  const url = formData.get("url")
                  const { supabase } = await import("@/lib/supabase")
                  // On enregistre le lien avec l'ID de l'utilisateur actuel
                  await supabase.from("profiles").insert([{ 
                    user_id: userId, 
                    google_maps_url: url 
                  }])
                  // Force le rafraîchissement pour passer à l'état Dashboard
                }} className="mt-8 flex w-full max-w-md gap-3">
                  <input 
                    name="url"
                    type="url" 
                    placeholder="https://www.google.com/maps/place/..." 
                    className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                  <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Activer
                  </button>
                </form>
              </div>
            ) : (
              /* ÉTAT : Dashboard Actif avec analyses filtrées */
              <>
                <StatsBar />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Dernières Analyses
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      Sync avec votre compte
                    </div>
                  </div>
                  
                  {reviews.length > 0 ? (
                    <ReviewGrid reviews={reviews} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 border rounded-xl bg-muted/20">
                      <div className="animate-bounce mb-4 text-3xl">🚀</div>
                      <p className="text-foreground font-semibold">Analyse initiale en cours...</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center">
                        Notre IA traite actuellement vos données. Cela prend généralement entre 2 et 5 minutes.
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