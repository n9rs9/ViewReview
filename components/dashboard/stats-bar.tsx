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
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.75)]"
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
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col justify-between gap-2 rounded-2xl border border-border/60 bg-[#0a0616] p-4 shadow-md shadow-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
              <card.icon className="size-5 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.label}
              </span>
              <span className="text-xl font-semibold text-foreground">
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
