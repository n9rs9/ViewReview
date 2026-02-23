import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import { supabase } from "@/lib/supabase"
import type { Review, Sentiment } from "@/components/dashboard/review-card"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

function getInitials(name: string): string {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function normalizeSentiment(value: unknown): Sentiment {
  const s = String(value ?? "").toLowerCase()
  if (s === "positive" || s === "neutral" || s === "negative") return s
  return "neutral"
}

export default async function Page() {
  // 1. Récupérer la session utilisateur
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/login") // Ou ta page de connexion
  }

  const userId = session.user.id

  // 2. Vérifier si l'utilisateur a déjà configuré son commerce (Slot Unique)
  const { data: profile } = await supabase
    .from("profiles")
    .select("google_maps_url")
    .eq("user_id", userId)
    .single()

  // 3. Récupérer les avis uniquement pour cet utilisateur
  const { data: reviewsData, error } = await supabase
    .from("reviews")
    .select("id, client_name, review_text, sentiment, created_at")
    .eq("user_id", userId) // Filtre de sécurité crucial
    .order("created_at", { ascending: false })

  const reviews: Review[] = (reviewsData ?? []).map((row) => ({
    id: String(row.id),
    clientName: row.client_name ?? "",
    clientInitials: getInitials(row.client_name ?? ""),
    text: row.review_text ?? "",
    sentiment: normalizeSentiment(row.sentiment),
    timestamp: row.created_at
      ? formatDistanceToNow(new Date(row.created_at), {
          addSuffix: true,
          locale: fr,
        })
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
              /* ÉTAT VIDE : Formulaire de premier commerce */
              <div className="rounded-lg border-2 border-dashed p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Bienvenue ! Configurez votre commerce</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Entrez l'URL Google Maps de votre établissement pour commencer l'analyse.
                  <br />
                  <strong className="text-destructive">Attention : Vous n'avez droit qu'à un seul slot. Ce choix est définitif.</strong>
                </p>
                <form action={async (formData) => {
                  "use server"
                  const url = formData.get("url")
                  const { supabase } = await import("@/lib/supabase")
                  await supabase.from("profiles").insert([{ 
                    user_id: userId, 
                    google_maps_url: url 
                  }])
                  // On force le rafraîchissement
                }} className="flex gap-2 max-w-md mx-auto">
                  <input 
                    name="url"
                    type="url" 
                    placeholder="https://www.google.com/maps/..." 
                    className="flex-1 p-2 border rounded bg-transparent"
                    required
                  />
                  <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium">
                    Activer mon slot
                  </button>
                </form>
              </div>
            ) : (
              /* ÉTAT ACTIF : Stats et Avis */
              <>
                <StatsBar />
                <div>
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Analyses Récentes
                  </h2>
                  {reviews.length > 0 ? (
                    <ReviewGrid reviews={reviews} />
                  ) : (
                    <div className="p-8 text-center border rounded">
                      Analyse en cours par l'IA... revenez dans quelques minutes.
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