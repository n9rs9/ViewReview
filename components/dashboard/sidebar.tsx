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
        "relative flex h-screen flex-col border-r border-[#8b5cf6]/25 bg-[radial-gradient(circle_at_top_left,#111827_0,#050316_45%,#000000_100%)] shadow-[0_0_45px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-border/70 px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/90 shadow-lg shadow-primary/40">
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
            "mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80",
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
              "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeItem === item.key
                ? "bg-primary/15 text-primary shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
            )}
          >
            <div
              className={cn(
                  "flex size-9 items-center justify-center rounded-xl border border-transparent bg-transparent transition-all group-hover:border-[#8b5cf6]/50 group-hover:bg-[#1b1036] group-hover:shadow-[0_0_18px_rgba(139,92,246,0.95)]",
                  activeItem === item.key
                    ? "border-primary/40 bg-primary/15 shadow-[0_0_14px_rgba(139,92,246,0.8)]"
                  : "bg-sidebar-accent/10 group-hover:bg-sidebar-accent/40"
              )}
            >
              <item.icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  activeItem === item.key
                    ? "text-[#8b5cf6]"
                    : "text-muted-foreground group-hover:text-[#8b5cf6]"
                )}
              />
            </div>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-2 border-t border-border/70 p-3">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-destructive transition-colors",
            "hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className="size-4" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-2xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
