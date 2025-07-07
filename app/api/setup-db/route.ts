import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerClient()

    // Check if profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "profiles")

    if (tablesError) {
      console.error("Error checking tables:", tablesError)
      return NextResponse.json({ error: "Failed to check database structure" }, { status: 500 })
    }

    if (!tables || tables.length === 0) {
      return NextResponse.json(
        {
          error: "Profiles table does not exist. Please run the database setup script.",
          setupRequired: true,
        },
        { status: 400 },
      )
    }

    // Get current user and create profile if needed
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      // Create profile
      const { error: createError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email || "",
        plan: "free",
        daily_usage: 0,
        total_scripts: 0,
      })

      if (createError) {
        console.error("Error creating profile:", createError)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }

      return NextResponse.json({ message: "Profile created successfully" })
    }

    return NextResponse.json({ message: "Database setup is complete", profile })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
