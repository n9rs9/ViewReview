"use client"

import { useState } from "react"
import { SlidersHorizontal, DollarSign, ChevronDown } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type TrendPoint = { date: string; value: number }

interface ReviewTrendChartProps {
  data: TrendPoint[]
}

const timeRanges = ["1h", "3h", "1d", "1w", "1m"] as const

export function ReviewTrendChart({ data }: ReviewTrendChartProps) {
  const [activeRange, setActiveRange] = useState<string>("1d")

  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const scaledData = data.map((d) => ({
    ...d,
    scaled: 10000 + (d.value / maxVal) * 40000,
    volume: 8000 + Math.random() * 4000,
  }))

  const currentValue =
    scaledData.length > 0 ? scaledData[scaledData.length - 1].scaled : 38252.02

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Chart</h3>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            USD
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Bitcoin/BTC</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main chart */}
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scaledData}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5c518" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f5c518" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#262626"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}.000`}
              domain={[10000, 50000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141414",
                borderRadius: 12,
                border: "1px solid #262626",
                color: "#f5f5f5",
              }}
              labelStyle={{ color: "#737373" }}
              formatter={(value: number) => [
                `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                "Price",
              ]}
            />
            <Area
              type="monotone"
              dataKey="scaled"
              stroke="#f5c518"
              strokeWidth={2}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume bars */}
      <div className="mt-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scaledData}>
            <Bar dataKey="volume" fill="#f5c518" opacity={0.3} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
