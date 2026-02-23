"use client"

import { useState } from "react"
import {
  MessageSquareText,
  Settings,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Reviews", icon: MessageSquareText, active: true },
  { label: "Settings", icon: Settings, active: false },
]

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Reviews")

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Star className="size-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            ViewReview
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <span
          className={cn(
            "mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground",
            collapsed && "sr-only"
          )}
        >
          Navigation
        </span>
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeItem === item.label
                ? "bg-sidebar-accent text-primary"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>
    </aside>
  )
}
