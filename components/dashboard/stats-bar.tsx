import { MessageSquareText, Star, ThumbsUp } from "lucide-react"

interface StatsBarProps {
  totalReviews: number
  averageRating: number | null
  positivePercentage: number | null
}

export function StatsBar({
  totalReviews,
  averageRating,
  positivePercentage,
}: StatsBarProps) {
  const cards = [
    {
      label: "Total d'avis",
      value: totalReviews.toLocaleString("fr-FR"),
      helper: "Tous les avis collectés",
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
      label: "Avis positifs",
      value:
        positivePercentage != null
          ? `${Math.round(positivePercentage)}%`
          : "—",
      helper: "Notes de 4 à 5 étoiles",
      icon: ThumbsUp,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm backdrop-blur-sm"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
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
      ))}
    </div>
  )
}
