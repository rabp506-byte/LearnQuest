import { createClient } from "@supabase/supabase-js";
import type { Character } from "@/lib/game-logic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCharacter(userId: string): Promise<Character | null> {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`Error fetching character: ${error.message}`);
  }

  return data as Character;
}
