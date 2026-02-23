export type Sentiment = "positive" | "negative" | "neutral"

export type Review = {
  id: string
  clientName: string
  clientInitials: string
  text: string
  sentiment: Sentiment
  timestamp: string
  rating: number
  createdAt: string
}
