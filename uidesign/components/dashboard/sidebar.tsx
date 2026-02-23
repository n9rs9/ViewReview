"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  User,
  LineChart,
  Wallet,
  Newspaper,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Account", icon: User, active: false },
  { label: "Chart", icon: LineChart, active: false },
  { label: "Wallet", icon: Wallet, active: false },
  { label: "News", icon: Newspaper, active: false },
  { label: "Settings", icon: Settings, active: false },
]

export function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <aside className="hidden lg:flex w-56 flex-col justify-between border-r border-border bg-background px-4 py-6">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary">
            <div className="h-5 w-5 rounded-full bg-primary" style={{ clipPath: "inset(0 50% 0 0)" }} />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            return (
              <button
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Logout */}
      <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
        <LogOut className="h-5 w-5" />
        Log out
      </button>
    </aside>
  )
}
