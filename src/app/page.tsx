"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import AuthForm from "@/components/AuthForm";
import CharacterStatus from "@/components/CharacterStatus";
import ClassSelector from "@/components/ClassSelector";
import { getCharacter, supabase } from "@/lib/supabase";
import type { Character } from "@/lib/game-logic";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCharacter(userId: string): Promise<Character | null> {
    return getCharacter(userId);
  }

  useEffect(() => {
    let isMounted = true;

    function updateLoading(nextLoading: boolean) {
      if (isMounted) {
        setLoading(nextLoading);
      }
    }

    function resetGameState() {
      if (isMounted) {
        setSession(null);
        setCharacter(null);
      }
    }

    async function loadSession() {
      updateLoading(true);

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("[LearnQuest] Supabase getSession failed", {
            message: error.message,
            name: error.name,
            status: error.status,
          });

          throw error;
        }

        if (!isMounted) return;

        setSession(session);

        if (!session?.user) {
          setCharacter(null);
          return;
        }

        try {
          const characterData = await loadCharacter(session.user.id);

          if (isMounted) {
            setCharacter(characterData);
          }
        } catch (characterError) {
          console.error("[LearnQuest] Character load failed after getSession", {
            userId: session.user.id,
            error: characterError,
          });

          if (isMounted) {
            setCharacter(null);
          }
        }
      } catch (sessionError) {
        console.error("[LearnQuest] Initial session load failed", {
          error: sessionError,
        });

        resetGameState();
      } finally {
        updateLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: string, newSession: Session | null) => {
        updateLoading(true);

        try {
          if (isMounted) {
            setSession(newSession);
          }

          if (!newSession?.user) {
            if (isMounted) {
              setCharacter(null);
            }

            return;
          }

          try {
            const characterData = await loadCharacter(newSession.user.id);

            if (isMounted) {
              setCharacter(characterData);
            }
          } catch (characterError) {
            console.error("[LearnQuest] Character load failed after auth change", {
              event,
              userId: newSession.user.id,
              error: characterError,
            });

            if (isMounted) {
              setCharacter(null);
            }
          }
        } catch (authChangeError) {
          console.error("[LearnQuest] Auth state change handling failed", {
            event,
            userId: newSession?.user?.id,
            error: authChangeError,
          });

          if (isMounted) {
            setCharacter(null);
          }
        } finally {
          updateLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setLoading(true);

    try {
      await supabase.auth.signOut();
      setSession(null);
      setCharacter(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-yellow-400" />
          <p className="text-lg font-semibold text-yellow-300">
            Cargando aventura...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return <AuthForm />;
  }

  const studentName =
    session.user.user_metadata?.username ||
    session.user.email ||
    "Aventurero";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-6xl rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-black/70">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-yellow-400">
              LearnQuest
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              Bienvenido, {studentName}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Tu aventura de aprendizaje continúa.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-slate-500 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-100 shadow-lg transition hover:border-yellow-400 hover:text-yellow-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]"
          >
            Cerrar Sesión
          </button>
        </div>

        {character ? (
          <div className="flex justify-center">
            <CharacterStatus character={character} studentName={studentName} />
          </div>
        ) : (
          <ClassSelector
            userId={session.user.id}
            onCharacterCreated={setCharacter}
          />
        )}
      </div>
    </main>
  );
}
