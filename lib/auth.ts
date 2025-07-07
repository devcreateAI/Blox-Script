import { supabase } from "./supabase"

export async function signUp(email: string, password: string, plan = "free") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        plan,
        daily_usage: 0,
        total_scripts: 0,
      },
    },
  })

  if (error) throw error

  // Create profile if user was created successfully
  if (data.user && !data.user.email_confirmed_at) {
    // For new signups, the profile will be created by the trigger
    console.log("New user signed up, profile will be created by trigger")
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("getCurrentUser: User found in session:", !!user)

  if (user) {
    console.log("getCurrentUser: Fetching profile for user:", user.id)

    // Get additional user data from profiles table
    let { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // If profile doesn't exist, create it
    if (profileError && profileError.code === "PGRST116") {
      console.log("getCurrentUser: Profile not found, attempting to create one for user:", user.id)

      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          plan: "pro",
          daily_usage: 0,
          total_scripts: 0,
        })
        .select()
        .single()

      if (!createError) {
        profile = newProfile
        console.log("getCurrentUser: Profile created successfully.")
      } else {
        console.error("getCurrentUser: Failed to create profile:", createError)
        console.error("Failed to create profile:", createError)
        // Return user with default profile data
        profile = {
          plan: "pro",
          daily_usage: 0,
          total_scripts: 0,
          email: user.email,
        }
      }
    }

    const finalUser = {
      ...user,
      ...profile,
    }

    return finalUser
  }

  return null
}
