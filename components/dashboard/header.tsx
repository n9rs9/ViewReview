"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    supabase.auth
      .getUser()
      .then(({ data, error }) => {
        if (error || !data.user) {
          router.replace("/login?redirectedFrom=/")
          return
        }

        setUserEmail(data.user.email ?? null)
      })
      .finally(() => {
        setCheckingAuth(false)
      })
  }, [router])

  function handleSync() {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()

    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
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
      {!checkingAuth && (
        <div className="flex items-center gap-4">
          {userEmail && (
            <p className="text-sm text-muted-foreground">
              Connecté en tant que :{" "}
              <span className="font-medium text-foreground">
                {userEmail}
              </span>
            </p>
          )}
          <Button
            variant="outline"
            onClick={handleSignOut}
          >
            Déconnexion
          </Button>
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
        </div>
      )}
    </header>
  )
}
