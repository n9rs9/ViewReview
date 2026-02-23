"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts"

type CryptoCardData = {
  name: string
  symbol: string
  price: string
  change: number
  color: string
  iconBg: string
  sparkline: { v: number }[]
}

const cryptoCards: CryptoCardData[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$52,291",
    change: 0.25,
    color: "#f5c518",
    iconBg: "#f5c518",
    sparkline: [{ v: 30 }, { v: 35 }, { v: 28 }, { v: 40 }, { v: 38 }, { v: 45 }, { v: 42 }],
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: "$8,291",
    change: 0.25,
    color: "#a0a0a0",
    iconBg: "#737373",
    sparkline: [{ v: 20 }, { v: 22 }, { v: 18 }, { v: 25 }, { v: 23 }, { v: 28 }, { v: 26 }],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$28,291",
    change: 0.25,
    color: "#22c55e",
    iconBg: "#22c55e",
    sparkline: [{ v: 40 }, { v: 42 }, { v: 38 }, { v: 45 }, { v: 50 }, { v: 48 }, { v: 52 }],
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: "$14,291",
    change: -0.25,
    color: "#22c55e",
    iconBg: "#737373",
    sparkline: [{ v: 35 }, { v: 38 }, { v: 32 }, { v: 40 }, { v: 42 }, { v: 45 }, { v: 48 }],
  },
]

export function CryptoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cryptoCards.map((card) => (
        <CryptoCard key={card.symbol} data={card} />
      ))}
    </div>
  )
}

function CryptoCard({ data }: { data: CryptoCardData }) {
  const isPositive = data.change >= 0

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: `${data.iconBg}20` }}
          >
            <span className="text-xs font-bold" style={{ color: data.iconBg }}>
              {data.symbol.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{data.name}</p>
            <p className="text-xs text-muted-foreground">{data.symbol}</p>
          </div>
        </div>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: data.color }}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-background" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-background" />
          )}
        </div>
      </div>

      {/* Price + Sparkline */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-foreground">{data.price}</p>
          <p
            className={`mt-1 text-xs font-medium ${isPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}
          >
            {isPositive ? "+" : ""}
            {data.change}%
          </p>
        </div>
        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.sparkline}>
              <defs>
                <linearGradient id={`grad-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={data.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={data.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={data.color}
                strokeWidth={1.5}
                fill={`url(#grad-${data.symbol})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
