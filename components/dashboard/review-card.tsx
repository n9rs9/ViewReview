import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Sentiment = "positive" | "neutral" | "negative"

export interface Review {
  id: string
  clientName: string
  clientInitials: string
  text: string
  sentiment: Sentiment
  timestamp: string
}

const sentimentConfig: Record<
  Sentiment,
  { label: string; className: string }
> = {
  positive: {
    label: "Positive",
    className: "border-transparent bg-emerald-500/15 text-emerald-400",
  },
  neutral: {
    label: "Neutral",
    className: "border-transparent bg-amber-500/15 text-amber-400",
  },
  negative: {
    label: "Negative",
    className: "border-transparent bg-rose-500/15 text-rose-400",
  },
}

export function ReviewCard({ review }: { review: Review }) {
  const sentimentStyle = sentimentConfig[review.sentiment]

  return (
    <Card className="group border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex-row items-center gap-3 pb-0">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            review.sentiment === "positive" && "bg-emerald-500/15 text-emerald-400",
            review.sentiment === "neutral" && "bg-amber-500/15 text-amber-400",
            review.sentiment === "negative" && "bg-rose-500/15 text-rose-400"
          )}
        >
          {review.clientInitials}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold text-card-foreground">
            {review.clientName}
          </span>
          <span className="text-xs text-muted-foreground">
            {review.timestamp}
          </span>
        </div>
        <Badge
          variant="outline"
          className={sentimentStyle.className}
        >
          {sentimentStyle.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {review.text}
        </p>
      </CardContent>
    </Card>
  )
}

