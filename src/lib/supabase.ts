/*
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
*/

import type { Character } from "@/lib/game-logic";
import {
  clearCharacterFromLocalStorage,
  loadCharacterFromLocalStorage,
  saveCharacterToLocalStorage,
} from "@/lib/local-storage";

const LOCAL_SESSION_STORAGE_KEY = "learnquest.session";

type AuthChangeEvent = "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT";

type AuthError = {
  message: string;
  name?: string;
  status?: number;
};

export interface LocalSession {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      username?: string;
    };
  };
}

type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: LocalSession | null,
) => void | Promise<void>;

const authListeners = new Set<AuthChangeCallback>();

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined";
}

function loadSessionFromLocalStorage(): LocalSession | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const storedSession = localStorage.getItem(LOCAL_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as LocalSession;
  } catch (error) {
    console.error("[LearnQuest] Failed to parse local session", { error });
    localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
    return null;
  }
}

function saveSessionToLocalStorage(session: LocalSession): void {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(LOCAL_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSessionFromLocalStorage(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
}

function createLocalSession(params: {
  email: string;
  username?: string;
}): LocalSession {
  return {
    user: {
      id: params.email.toLowerCase().trim() || "local-adventurer",
      email: params.email,
      user_metadata: {
        username: params.username,
      },
    },
  };
}

function notifyAuthListeners(
  event: AuthChangeEvent,
  session: LocalSession | null,
): void {
  authListeners.forEach((listener) => {
    void listener(event, session);
  });
}

function createAuthError(message: string, status = 400): AuthError {
  return {
    message,
    name: "LocalSupabaseMockError",
    status,
  };
}

function createCharacterQueryBuilder() {
  let insertedCharacter: Partial<Character> | null = null;
  let profileIdFilter: string | null = null;

  const builder = {
    insert(character: Partial<Character>) {
      insertedCharacter = character;
      return builder;
    },
    select(_columns = "*") {
      return builder;
    },
    eq(column: string, value: string) {
      if (column === "profile_id") {
        profileIdFilter = value;
      }

      return builder;
    },
    async single(): Promise<{ data: Character | null; error: AuthError | null }> {
      if (insertedCharacter) {
        const now = new Date().toISOString();
        const character = {
          id: insertedCharacter.id ?? crypto.randomUUID(),
          profile_id: insertedCharacter.profile_id ?? "local-adventurer",
          hp: insertedCharacter.hp ?? 50,
          max_hp: insertedCharacter.max_hp ?? 50,
          xp: insertedCharacter.xp ?? 0,
          ap: insertedCharacter.ap ?? 50,
          max_ap: insertedCharacter.max_ap ?? 50,
          pp: insertedCharacter.pp ?? 0,
          level: insertedCharacter.level ?? 1,
          class: insertedCharacter.class ?? "guerrero",
          gold: insertedCharacter.gold ?? 0,
          created_at: insertedCharacter.created_at ?? now,
          updated_at: now,
        } satisfies Character;

        saveCharacterToLocalStorage(character);

        return { data: character, error: null };
      }

      const character = loadCharacterFromLocalStorage();

      if (!character || character.profile_id !== profileIdFilter) {
        return {
          data: null,
          error: createAuthError("Local character not found", 404),
        };
      }

      return { data: character, error: null };
    },
  };

  return builder;
}

export const supabase = {
  auth: {
    async getSession(): Promise<{
      data: { session: LocalSession | null };
      error: AuthError | null;
    }> {
      return {
        data: { session: loadSessionFromLocalStorage() },
        error: null,
      };
    },
    onAuthStateChange(callback: AuthChangeCallback) {
      authListeners.add(callback);

      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback);
            },
          },
        },
      };
    },
    async signUp(params: {
      email: string;
      password: string;
      options?: { data?: { username?: string } };
    }): Promise<{ data: { session: LocalSession }; error: AuthError | null }> {
      if (!params.email || !params.password) {
        return {
          data: { session: createLocalSession({ email: params.email }) },
          error: createAuthError("Email and password are required."),
        };
      }

      const session = createLocalSession({
        email: params.email,
        username: params.options?.data?.username,
      });

      saveSessionToLocalStorage(session);
      notifyAuthListeners("SIGNED_IN", session);

      return { data: { session }, error: null };
    },
    async signInWithPassword(params: {
      email: string;
      password: string;
    }): Promise<{ data: { session: LocalSession }; error: AuthError | null }> {
      if (!params.email || !params.password) {
        return {
          data: { session: createLocalSession({ email: params.email }) },
          error: createAuthError("Email and password are required."),
        };
      }

      const storedSession = loadSessionFromLocalStorage();
      const session =
        storedSession?.user.email === params.email
          ? storedSession
          : createLocalSession({ email: params.email });

      saveSessionToLocalStorage(session);
      notifyAuthListeners("SIGNED_IN", session);

      return { data: { session }, error: null };
    },
    async signOut(): Promise<{ error: AuthError | null }> {
      clearSessionFromLocalStorage();
      clearCharacterFromLocalStorage();
      notifyAuthListeners("SIGNED_OUT", null);

      return { error: null };
    },
  },
  from(tableName: string) {
    if (tableName !== "characters") {
      throw new Error(`Local Supabase mock does not support table: ${tableName}`);
    }

    return createCharacterQueryBuilder();
  },
};

export async function getCharacter(userId: string): Promise<Character | null> {
  const character = loadCharacterFromLocalStorage();

  if (!character || character.profile_id !== userId) {
    return null;
  }

  return character;
}
