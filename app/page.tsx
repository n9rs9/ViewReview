 "use client"

import { useEffect, useState } from "react"
import {
  formatDistanceToNow,
  format,
  startOfDay,
  subDays,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import type { Review, Sentiment } from "@/components/dashboard/review-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export const dynamic = "force-dynamic"

type TrendPoint = {
  date: string
  value: number
}

function getInitials(name: string): string {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function normalizeSentimentFromRating(rating: number): Sentiment {
  if (rating >= 4) return "positive"
  if (rating <= 2) return "negative"
  return "neutral"
}

function buildStats(reviews: Review[]) {
  const total = reviews.length
  if (!total) {
    return {
      totalReviews: 0,
      averageRating: null,
      positivePercentage: null,
    }
  }

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  const averageRating = sum / total
  const positiveCount = reviews.filter((r) => r.rating >= 4).length

  return {
    totalReviews: total,
    averageRating,
    positivePercentage: (positiveCount / total) * 100,
  }
}

function buildTrendData(reviews: Review[]): TrendPoint[] {
  const today = startOfDay(new Date())
  const buckets: TrendPoint[] = []

  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i)
    const label = format(day, "dd MMM", { locale: fr })
    buckets.push({ date: label, value: 0 })
  }

  const byLabel = new Map<string, TrendPoint>()
  for (const point of buckets) {
    byLabel.set(point.date, point)
  }

  for (const review of reviews) {
    const created = new Date(review.createdAt)
    const day = startOfDay(created)
    const label = format(day, "dd MMM", { locale: fr })
    const bucket = byLabel.get(label)
    if (bucket) {
      bucket.value += 1
    }
  }

  return buckets
}

function ReviewTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card className="h-full border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Évolution du nombre d'avis (7 derniers jours)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-60 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="reviewsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: "var(--chart-1)", strokeWidth: 1, opacity: 0.2 }}
              contentStyle={{
                backgroundColor: "var(--card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2.2}
              fill="url(#reviewsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [trendData, setTrendData] = useState<TrendPoint[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [positivePercentage, setPositivePercentage] = useState<number | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let isMounted = true

    async function fetchData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          if (!user) {
            setError("Vous devez être connecté pour voir vos avis.")
          } else {
            setError(userError?.message ?? "Erreur lors de la récupération de l'utilisateur.")
          }
          return
        }

        const { data, error } = await supabase
          .from("reviews")
          .select(
            "id, client_name, review_text, sentiment, rating, user_id, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Erreur Supabase reviews:", error)
          setError("Impossible de charger les avis.")
          return
        }

        const mapped: Review[] = (data ?? []).map((row: any) => {
          const createdAt = row.created_at ?? new Date().toISOString()
          const rawRating = typeof row.rating === "number"
            ? row.rating
            : Number(row.rating ?? 0)
          const rating = Number.isFinite(rawRating) ? rawRating : 0

          const sentiment: Sentiment =
            typeof row.sentiment === "string"
              ? (String(row.sentiment).toLowerCase() as Sentiment)
              : normalizeSentimentFromRating(rating)

          return {
            id: String(row.id),
            clientName: row.client_name ?? "",
            clientInitials: getInitials(row.client_name ?? ""),
            text: row.review_text ?? "",
            sentiment,
            timestamp: createdAt
              ? formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: fr,
                })
              : "—",
            rating,
            createdAt,
          }
        })

        if (!isMounted) return

        const stats = buildStats(mapped)
        const trend = buildTrendData(mapped)

        setReviews(mapped)
        setTotalReviews(stats.totalReviews)
        setAverageRating(stats.averageRating)
        setPositivePercentage(stats.positivePercentage)
        setTrendData(trend)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <StatsBar
                  totalReviews={totalReviews}
                  averageRating={averageRating}
                  positivePercentage={positivePercentage}
                />
              </div>
              <div className="lg:col-span-2">
                <ReviewTrendChart data={trendData} />
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Derniers avis clients
              </h2>
              {loading && (
                <p className="text-sm text-muted-foreground">
                  Chargement des avis...
                </p>
              )}
              {error && !loading && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {!loading && !error && reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun avis pour le moment. Connectez vos sources et commencez à collecter des retours clients.
                </p>
              )}
              {!loading && !error && reviews.length > 0 && (
                <ReviewGrid reviews={reviews} />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
