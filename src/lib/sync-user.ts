import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "./supabase-admin";
import { Profile } from "./database";

export async function syncUser() {
  const { userId } = await auth();
  
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  // Check if profile exists using admin client
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  if (!profile) {
    console.log("Creating profile for user:", userId);
    
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert([{
        clerk_id: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Citizen User",
        role: 'citizen',
        avatar_url: user.imageUrl || null
      }])
      .select()
      .single();

    if (createError) {
      console.error("Error creating profile:", createError.message);
      return null;
    }
    return newProfile as Profile;
  }

  return profile as Profile;
}
