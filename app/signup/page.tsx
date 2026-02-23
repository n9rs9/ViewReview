"use client"

import Link from "next/link"
import { Suspense, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      console.log("Utilisateur créé :", data?.user)

      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background/80 px-4">
      <Card className="w-full max-w-md border-border/60 bg-card/95 shadow-xl shadow-primary/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-4" />
            </span>
            Créer un compte ViewReview
          </CardTitle>
          <CardDescription>
            Inscrivez-vous avec votre email pour accéder au dashboard des avis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Choisissez un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Chargement...</div>}>
      <SignupForm />
    </Suspense>
  )
}

