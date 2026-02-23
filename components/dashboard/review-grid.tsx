import { ReviewCard, type Review } from "./review-card"

interface ReviewGridProps {
  reviews: Review[]
}

export function ReviewGrid({ reviews }: ReviewGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
