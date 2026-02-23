"use client"

import { MoreHorizontal } from "lucide-react"
import type { Review } from "@/components/dashboard/review-card"

interface PortfolioSectionProps {
  reviews: Review[]
}

type PortfolioItem = {
  name: string
  symbol: string
  percentage: number
  change: number
  color: string
}

const fallbackPortfolio: PortfolioItem[] = [
  { name: "Bitcoin", symbol: "BTC", percentage: 37, change: 2.5, color: "#f5c518" },
  { name: "Tether", symbol: "USDT", percentage: 23, change: -3.5, color: "#22c55e" },
  { name: "Ethereum", symbol: "ETH", percentage: 20, change: -1.5, color: "#3b82f6" },
  { name: "Ripple", symbol: "XLA", percentage: 17, change: 3.5, color: "#a855f7" },
  { name: "Ethereum", symbol: "ETH", percentage: 20, change: 2.5, color: "#22c55e" },
]

function mapReviewsToPortfolio(reviews: Review[]): PortfolioItem[] {
  if (reviews.length === 0) return fallbackPortfolio

  const sentimentGroups = { positive: 0, neutral: 0, negative: 0 }
  reviews.forEach((r) => {
    sentimentGroups[r.sentiment] += 1
  })

  const total = reviews.length
  const items: PortfolioItem[] = []

  if (sentimentGroups.positive > 0) {
    items.push({
      name: "Positifs",
      symbol: "POS",
      percentage: Math.round((sentimentGroups.positive / total) * 100),
      change: 2.5,
      color: "#22c55e",
    })
  }
  if (sentimentGroups.neutral > 0) {
    items.push({
      name: "Neutres",
      symbol: "NEU",
      percentage: Math.round((sentimentGroups.neutral / total) * 100),
      change: -1.5,
      color: "#f5c518",
    })
  }
  if (sentimentGroups.negative > 0) {
    items.push({
      name: "Negatifs",
      symbol: "NEG",
      percentage: Math.round((sentimentGroups.negative / total) * 100),
      change: -3.5,
      color: "#ef4444",
    })
  }

  return items.length > 0 ? items : fallbackPortfolio
}

export function PortfolioSection({ reviews }: PortfolioSectionProps) {
  const portfolio = mapReviewsToPortfolio(reviews)

  return (
    <div className="rounded-2xl bg-primary p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary-foreground">My Portfolio</h3>
        <button className="rounded-lg p-1 text-primary-foreground/70 hover:text-primary-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {portfolio.map((item, i) => {
          const isPositive = item.change >= 0
          return (
            <div key={`${item.symbol}-${i}`} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>
                    {item.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">{item.name}</p>
                  <p className="text-xs text-primary-foreground/60">{item.symbol}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary-foreground">
                  {item.percentage}%
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isPositive
                      ? "bg-[#22c55e]/20 text-[#22c55e]"
                      : "bg-[#ef4444]/20 text-[#ef4444]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {item.change}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
