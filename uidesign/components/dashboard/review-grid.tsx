"use client"

import type { Review } from "@/components/dashboard/review-card"
import { Star } from "lucide-react"

interface ReviewGridProps {
  reviews: Review[]
}

export function ReviewGrid({ reviews }: ReviewGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.slice(0, 6).map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  )
}

function ReviewItem({ review }: { review: Review }) {
  const sentimentColor =
    review.sentiment === "positive"
      ? "border-[#22c55e]/30 bg-[#22c55e]/5"
      : review.sentiment === "negative"
        ? "border-[#ef4444]/30 bg-[#ef4444]/5"
        : "border-primary/30 bg-primary/5"

  const sentimentText =
    review.sentiment === "positive"
      ? "text-[#22c55e]"
      : review.sentiment === "negative"
        ? "text-[#ef4444]"
        : "text-primary"

  return (
    <div className={`rounded-2xl border p-4 ${sentimentColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
            {review.clientInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{review.clientName}</p>
            <p className="text-xs text-muted-foreground">{review.timestamp}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{review.text}</p>
      <div className="mt-3">
        <span className={`text-xs font-medium ${sentimentText}`}>
          {review.sentiment === "positive"
            ? "Positif"
            : review.sentiment === "negative"
              ? "Negatif"
              : "Neutre"}
        </span>
      </div>
    </div>
  )
}
