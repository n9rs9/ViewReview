import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import { supabase } from "@/lib/supabase"
import type { Review, Sentiment } from "@/components/dashboard/review-card"

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

async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, client_name, review_text, sentiment, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erreur Supabase reviews:", error)
    return []
  }

  return (data ?? []).map((row) => ({
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
}

export default async function Page() {
  const reviews = await getReviews()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <StatsBar />
            <div>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Recent Reviews
              </h2>
              <ReviewGrid reviews={reviews} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
