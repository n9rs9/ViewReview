 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquareText,
  Settings,
  LogOut,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "reviews", label: "Mes avis", icon: MessageSquareText },
  { key: "settings", label: "Paramètres", icon: Settings },
]

export function DashboardSidebar() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    try {
      setLoggingOut(true)
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border/70 bg-[#04030a] transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/70 px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary">
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
            key={item.key}
            onClick={() => setActiveItem(item.key)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeItem === item.key
                ? "bg-primary/15 text-primary shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border/70 p-3 space-y-2">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors",
            "hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
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
