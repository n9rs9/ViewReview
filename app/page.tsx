import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import { supabase } from "@/lib/supabase"
import type { Review, Sentiment } from "@/components/dashboard/review-card"

export const dynamic = "force-dynamic"

// Fonction utilitaire pour les initiales
function getInitials(name: string): string {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Fonction utilitaire pour le sentiment
function normalizeSentiment(value: unknown): Sentiment {
  const s = String(value ?? "").toLowerCase()
  if (s === "positive" || s === "neutral" || s === "negative") return s
  return "neutral"
}

export default async function Page() {
  // 1. Récupération de la session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Si pas de session, on affiche un bouton de redirection au lieu de planter
  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground mb-6">Vous devez être connecté pour accéder au dashboard.</p>
        <a href="/login" className="rounded-md bg-primary px-6 py-2 text-primary-foreground font-medium hover:opacity-90 transition-all">
          Se connecter
        </a>
        <script dangerouslySetInnerHTML={{ __html: 'setTimeout(() => window.location.href = "/login", 1500)' }} />
      </div>
    )
  }

  const userId = session.user.id

  // 2. Vérification du Slot Unique (profiles)
  const { data: profile } = await supabase
    .from("profiles")
    .select("google_maps_url")
    .eq("user_id", userId)
    .single()

  // 3. Récupération des avis filtrés par l'utilisateur connecté
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
              /* ÉTAT : Pas de commerce enregistré (Configuration) */
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted p-12 transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl">🏪</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Configurez votre commerce</h2>
                <p className="mt-2 text-center text-muted-foreground max-w-sm">
                  Collez le lien Google Maps de votre établissement pour lancer l'IA.
                </p>
                <div className="mt-6 w-full max-w-md p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
                  ⚠️ Attention : Vous ne disposez que d'un seul slot. Ce choix est définitif.
                </div>
                
                <form action={async (formData) => {
                  "use server"
                  const url = formData.get("url")
                  const { supabase } = await import("@/lib/supabase")
                  // On insère l'ID utilisateur et l'URL
                  await supabase.from("profiles").insert([{ 
                    user_id: userId, 
                    google_maps_url: url 
                  }])
                }} className="mt-8 flex w-full max-w-md gap-3">
                  <input 
                    name="url"
                    type="url" 
                    placeholder="Lien Google Maps..." 
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                  <button type="submit" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Activer
                  </button>
                </form>
              </div>
            ) : (
              /* ÉTAT : Dashboard Actif */
              <>
                <StatsBar />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Analyses Récentes
                    </h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Filtre : Vos avis uniquement
                    </span>
                  </div>
                  {reviews.length > 0 ? (
                    <ReviewGrid reviews={reviews} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 border rounded-lg bg-muted/30">
                      <div className="animate-spin mb-4 text-2xl">⚙️</div>
                      <p className="text-muted-foreground font-medium">L'IA analyse vos premiers avis...</p>
                      <p className="text-xs text-muted-foreground mt-1">Cela peut prendre jusqu'à 5 minutes.</p>
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