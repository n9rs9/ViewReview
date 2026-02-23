"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"

type TrendPoint = { date: string; value: number }

interface StatsBarProps {
  totalReviews: number
  averageRating: number | null
  reviewsThisMonth: number
  sparklineData: TrendPoint[]
}

export function StatsBar({
  totalReviews,
  averageRating,
  reviewsThisMonth,
  sparklineData,
}: StatsBarProps) {
  const todayChange = -2.5
  const weekChange = 4.25
  const monthChange = 11.5

  const totalValue = totalReviews > 0 ? `$${(totalReviews * 1000 + 154610).toLocaleString("en-US")}` : "$154,610"

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {/* Total balance */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total Balance
          </p>
          <p className="mt-2 text-4xl font-bold text-foreground">
            {totalValue}
            <span className="text-lg text-muted-foreground">.00</span>
          </p>
        </div>

        {/* Period stats */}
        <div className="flex gap-6">
          <PeriodStat label="Today" value={todayChange} />
          <PeriodStat label="7 Days" value={weekChange} />
          <PeriodStat label="30 Days" value={monthChange} />
        </div>
      </div>
    </div>
  )
}

function PeriodStat({ label, value }: { label: string; value: number }) {
  const isPositive = value >= 0
  return (
    <div className="text-right">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-end gap-1">
        <span
          className={`text-sm font-semibold ${isPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}
        >
          {isPositive ? "+" : ""}
          {value}%
        </span>
        {isPositive ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-[#22c55e]" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-[#ef4444]" />
        )}
      </div>
    </div>
  )
}
