"use client";

import { useEffect, useState } from "react";

import CharacterStatus from "@/components/CharacterStatus";
import ClassSelector from "@/components/ClassSelector";
import type { Character } from "@/lib/game-logic";
import {
  clearCharacterFromLocalStorage,
  loadCharacterFromLocalStorage,
} from "@/lib/local-storage";

export default function Home() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCharacter = loadCharacterFromLocalStorage();
    setCharacter(storedCharacter);
    setLoading(false);
  }, []);

  function handleResetCharacter() {
    clearCharacterFromLocalStorage();
    setCharacter(null);
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

  const studentName = "Aventurero Local";

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
              Tu aventura local de aprendizaje continúa.
            </p>
          </div>

          {character && (
            <button
              type="button"
              onClick={handleResetCharacter}
              className="rounded-xl border border-slate-500 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-100 shadow-lg transition hover:border-yellow-400 hover:text-yellow-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            >
              Reiniciar Personaje
            </button>
          )}
        </div>

        {character ? (
          <div className="flex justify-center">
            <CharacterStatus character={character} studentName={studentName} />
          </div>
        ) : (
          <ClassSelector onCharacterCreated={setCharacter} />
        )}
      </div>
    </main>
  );
}
