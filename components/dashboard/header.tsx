"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const [syncing, setSyncing] = useState(false)

  function handleSync() {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 lg:px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Customer Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-powered sentiment analysis across all channels
        </p>
      </div>
      <Button
        onClick={handleSync}
        disabled={syncing}
        className="bg-primary text-primary-foreground hover:bg-primary/80"
      >
        <RefreshCw
          className={cn("size-4", syncing && "animate-spin")}
        />
        {syncing ? "Syncing..." : "Sync"}
      </Button>
    </header>
  )
}
