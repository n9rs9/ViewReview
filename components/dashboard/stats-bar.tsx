import { MessageSquareText, Star, Clock3 } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

type SparklinePoint = {
  date: string
  value: number
}

interface StatsBarProps {
  totalReviews: number
  averageRating: number | null
  reviewsThisMonth: number
  positivePercentage: number | null
  sparklineData: SparklinePoint[]
}

function Sparkline({ data }: { data: SparklinePoint[] }) {
  if (!data.length) return null

  return (
    <div className="mt-2 h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="sparklineGradient"
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
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={1.6}
            fill="url(#sparklineGradient)"
            className="drop-shadow-[0_0_12px_rgba(139,92,246,0.9)]"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StatsBar({
  totalReviews,
  averageRating,
  reviewsThisMonth,
  positivePercentage,
  sparklineData,
}: StatsBarProps) {
  const cards = [
    {
      label: "Total avis",
      value: totalReviews.toLocaleString("fr-FR"),
      helper: "Tous les avis enregistrés",
      icon: MessageSquareText,
    },
    {
      label: "Note moyenne",
      value:
        averageRating && averageRating > 0
          ? `${averageRating.toFixed(1)}/5`
          : "—",
      helper: "Basée sur les notes clients",
      icon: Star,
    },
    {
      label: "Nouveaux ce mois-ci",
      value: reviewsThisMonth.toLocaleString("fr-FR"),
      helper: "Avis reçus depuis le 1er",
      icon: Clock3,
    },
    {
      label: "Taux de satisfaction",
      value:
        typeof positivePercentage === "number"
          ? `${positivePercentage.toFixed(0)}%`
          : "—",
      helper: "Part des avis positifs",
      icon: MessageSquareText,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group flex flex-col justify-between gap-2 rounded-3xl border border-[#8b5cf6]/30 bg-[rgba(15,15,25,0.9)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 transition-all group-hover:bg-primary/25 group-hover:shadow-[0_0_18px_rgba(139,92,246,0.95)]">
              <card.icon className="size-5 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.label}
              </span>
              <span className="text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {card.helper}
              </span>
            </div>
          </div>
          <Sparkline data={sparklineData} />
        </div>
      ))}
    </div>
  )
}
