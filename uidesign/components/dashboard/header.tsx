"use client"

import { Search, Mail, Bell } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
      <h1 className="text-xl font-bold text-primary">Dashboard</h1>

      {/* Search bar */}
      <div className="hidden md:flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 w-full max-w-md mx-8">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Mail className="h-5 w-5" />
          <span className="sr-only">Messages</span>
        </button>
        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <div className="h-10 w-10 rounded-full border-2 border-primary bg-secondary" />
      </div>
    </header>
  )
}
