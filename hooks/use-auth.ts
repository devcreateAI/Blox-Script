"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { signOut as authSignOut } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session and profile data
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Get profile data from database
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          ...session.user,
          ...profile,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    loadUserData()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get profile data from database
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          ...session.user,
          ...profile,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await authSignOut()
    setUser(null)
  }

  return {
    user,
    loading,
    signOut,
  }
}
