import { Badge } from "@/components/ui/badge"
import { MessageSquareText, TrendingUp, TrendingDown, Minus } from "lucide-react"

const stats = [
  {
    label: "Total Reviews",
    value: "1,284",
    icon: MessageSquareText,
    change: "+12%",
    trend: "up" as const,
  },
  {
    label: "Positive",
    value: "842",
    icon: TrendingUp,
    change: "+8%",
    trend: "up" as const,
  },
  {
    label: "Neutral",
    value: "319",
    icon: Minus,
    change: "-2%",
    trend: "neutral" as const,
  },
  {
    label: "Negative",
    value: "123",
    icon: TrendingDown,
    change: "-5%",
    trend: "down" as const,
  },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <stat.icon className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {stat.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {stat.value}
              </span>
              <Badge
                variant="outline"
                className={
                  stat.trend === "up"
                    ? "border-transparent bg-emerald-500/15 text-emerald-400 text-[10px] px-1.5 py-0"
                    : stat.trend === "down"
                    ? "border-transparent bg-rose-500/15 text-rose-400 text-[10px] px-1.5 py-0"
                    : "border-transparent bg-amber-500/15 text-amber-400 text-[10px] px-1.5 py-0"
                }
              >
                {stat.change}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
