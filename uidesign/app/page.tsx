"use client"

import { useEffect, useState } from "react"
import {
  formatDistanceToNow,
  format,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns"
import { fr } from "date-fns/locale"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { CryptoCards } from "@/components/dashboard/crypto-cards"
import { PortfolioSection } from "@/components/dashboard/portfolio-section"
import { ReviewTrendChart } from "@/components/dashboard/review-trend-chart"
import { ReviewGrid } from "@/components/dashboard/review-grid"
import type { Review, Sentiment } from "@/components/dashboard/review-card"
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
      reviewsThisMonth: 0,
    }
  }

  const now = new Date()
  const monthStart = startOfMonth(now)

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  const averageRating = sum / total
  const positiveCount = reviews.filter((r) => r.rating >= 4).length
  const reviewsThisMonth = reviews.filter(
    (r) => new Date(r.createdAt) >= monthStart
  ).length

  return {
    totalReviews: total,
    averageRating,
    positivePercentage: (positiveCount / total) * 100,
    reviewsThisMonth,
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

function buildMockTrendData(): TrendPoint[] {
  const today = startOfDay(new Date())
  const baseValues = [6, 9, 7, 11, 10, 14, 12]

  return baseValues.map((value, index) => {
    const day = subDays(today, baseValues.length - 1 - index)
    const label = format(day, "dd MMM", { locale: fr })
    return { date: label, value }
  })
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [trendData, setTrendData] = useState<TrendPoint[]>(() =>
    buildMockTrendData()
  )
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [positivePercentage, setPositivePercentage] = useState<number | null>(
    null
  )
  const [reviewsThisMonth, setReviewsThisMonth] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    let isMounted = true

    async function fetchData() {
      if (!supabase) {
        // No Supabase credentials configured — show demo state
        if (isMounted) {
          setError(null)
          setLoading(false)
        }
        return
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          if (!user) {
            setError("Vous devez etre connecte pour voir vos avis.")
          } else {
            setError(
              userError?.message ??
                "Erreur lors de la recuperation de l'utilisateur."
            )
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
          const rawRating =
            typeof row.rating === "number"
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
              : "\u2014",
            rating,
            createdAt,
          }
        })

        if (!isMounted) return

        const stats = buildStats(mapped)
        const trend =
          mapped.length > 0 ? buildTrendData(mapped) : buildMockTrendData()

        setReviews(mapped)
        setTotalReviews(stats.totalReviews)
        setAverageRating(stats.averageRating)
        setPositivePercentage(stats.positivePercentage)
        setReviewsThisMonth(stats.reviewsThisMonth)
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
        <main className="flex-1 overflow-y-auto bg-secondary/50 px-6 py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            {/* Total Balance */}
            <StatsBar
              totalReviews={totalReviews}
              averageRating={averageRating}
              reviewsThisMonth={reviewsThisMonth}
              positivePercentage={positivePercentage}
              sparklineData={trendData}
            />

            {/* Crypto cards row */}
            <CryptoCards />

            {/* Bottom section: Portfolio + Chart */}
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <PortfolioSection reviews={reviews} />
              <ReviewTrendChart data={trendData} />
            </div>

            {/* Reviews section */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Derniers avis clients
              </h2>
              {loading && (
                <p className="text-sm text-muted-foreground">
                  Chargement des avis...
                </p>
              )}
              {error && !loading && (
                <p className="text-sm text-[#ef4444]">{error}</p>
              )}
              {!loading && !error && reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun avis pour le moment. Connectez vos sources et commencez
                  a collecter des retours clients.
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
