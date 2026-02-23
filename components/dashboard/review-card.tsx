import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export type Sentiment = "positive" | "neutral" | "negative"

export interface Review {
  id: string
  clientName: string
  clientInitials: string
  text: string
  sentiment: Sentiment
  timestamp: string
  rating: number
  createdAt: string
}

function getBadgeConfig(rating: number) {
  if (rating >= 4) {
    return {
      label: "Avis positif",
      className: "border-transparent bg-emerald-500/15 text-emerald-400",
    }
  }

  if (rating <= 2) {
    return {
      label: "Avis négatif",
      className: "border-transparent bg-rose-500/15 text-rose-400",
    }
  }

  return {
    label: "Avis neutre",
    className: "border-transparent bg-amber-500/15 text-amber-400",
  }
}

const MAX_STARS = 5

export function ReviewCard({ review }: { review: Review }) {
  const badgeConfig = getBadgeConfig(review.rating)
  const safeRating = Number.isFinite(review.rating) ? review.rating : 0
  const roundedRating = Math.max(0, Math.min(MAX_STARS, Math.round(safeRating)))

  return (
    <Card className="group border-border/60 bg-card/95 shadow-sm transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="flex-row items-center gap-3 pb-2">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            safeRating >= 4 && "bg-emerald-500/15 text-emerald-400",
            safeRating <= 2 && "bg-rose-500/15 text-rose-400",
            safeRating > 2 && safeRating < 4 && "bg-amber-500/15 text-amber-400"
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
          <div className="mt-1 flex items-center gap-1.5">
            {Array.from({ length: MAX_STARS }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  "size-3.5",
                  index < roundedRating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              {safeRating > 0 ? `${safeRating.toFixed(1)}/5` : "—"}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={badgeConfig.className}
        >
          {badgeConfig.label}
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
