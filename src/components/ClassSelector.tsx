"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Character, CharacterClass } from "@/lib/game-logic";
import { GAME_CONSTANTS } from "@/lib/game-logic";

interface ClassSelectorProps {
  userId: string;
  onCharacterCreated?: (character: Character) => void;
}

interface ClassCard {
  className: CharacterClass;
  title: string;
  role: string;
  description: string;
  glowClass: string;
  borderClass: string;
  buttonClass: string;
}

const CLASS_CARDS: ClassCard[] = [
  {
    className: "guerrero",
    title: "Guerrero",
    role: "Tanque",
    description:
      "Protector del equipo. Resiste daño y puede defender a aliados vulnerables.",
    glowClass: "hover:shadow-[0_0_35px_rgba(239,68,68,0.45)]",
    borderClass: "border-red-500/50 hover:border-red-400",
    buttonClass:
      "from-red-700 via-red-600 to-orange-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]",
  },
  {
    className: "mago",
    title: "Mago",
    role: "Daño",
    description:
      "Maestro de la energía. Tiene mucho AP y puede apoyar al equipo con poder mágico.",
    glowClass: "hover:shadow-[0_0_35px_rgba(59,130,246,0.45)]",
    borderClass: "border-blue-500/50 hover:border-blue-400",
    buttonClass:
      "from-blue-700 via-blue-600 to-cyan-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]",
  },
  {
    className: "curandero",
    title: "Curandero",
    role: "Soporte",
    description:
      "Guardián vital del grupo. Restaura HP y mantiene al equipo en batalla.",
    glowClass: "hover:shadow-[0_0_35px_rgba(34,197,94,0.45)]",
    borderClass: "border-emerald-500/50 hover:border-emerald-400",
    buttonClass:
      "from-emerald-700 via-emerald-600 to-yellow-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]",
  },
];

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-yellow-400/30 bg-black/30 px-4 py-3 text-center shadow-inner">
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default function ClassSelector({
  userId,
  onCharacterCreated,
}: ClassSelectorProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(
    null,
  );
  const [loadingClass, setLoadingClass] = useState<CharacterClass | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function createCharacter(characterClass: CharacterClass) {
    setLoadingClass(characterClass);
    setSelectedClass(characterClass);
    setErrorMessage(null);

    const baseStats = GAME_CONSTANTS.BASE_STATS[characterClass];

    try {
      const { data, error } = await supabase
        .from("characters")
        .insert({
          profile_id: userId,
          class: characterClass,

          hp: baseStats.hp,
          max_hp: baseStats.max_hp,

          xp: 0,

          ap: baseStats.ap,
          max_ap: baseStats.max_ap,

          pp: baseStats.pp,

          level: 1,
          gold: 0,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      onCharacterCreated?.(data as Character);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo crear el personaje.";

      setErrorMessage(message);
    } finally {
      setLoadingClass(null);
    }
  }

  return (
    <section className="w-full max-w-6xl rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-slate-950 via-zinc-950 to-stone-950 p-6 text-white shadow-2xl shadow-black/80">
      <div className="mb-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-400">
          Selección de Clase
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
          Elige tu destino
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Cada clase tiene un rol diferente dentro del equipo. Escoge con
          cuidado: tu personaje será parte de la aventura de aprendizaje.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-500/60 bg-red-950/40 px-5 py-4 text-sm font-medium text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {CLASS_CARDS.map((classCard) => {
          const stats = GAME_CONSTANTS.BASE_STATS[classCard.className];
          const isSelected = selectedClass === classCard.className;
          const isLoading = loadingClass === classCard.className;

          return (
            <article
              key={classCard.className}
              className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-b from-slate-900 via-slate-950 to-black p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 ${classCard.borderClass} ${classCard.glowClass} ${
                isSelected ? "ring-2 ring-yellow-400/70" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-yellow-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-5 shadow-inner">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
                    {classCard.role}
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-white">
                    {classCard.title}
                  </h3>

                  <p className="mt-4 min-h-20 text-sm leading-6 text-slate-300">
                    {classCard.description}
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <StatPill label="HP" value={stats.max_hp} />
                  <StatPill label="AP" value={stats.max_ap} />
                </div>

                <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-300">
                      Resistencia
                    </span>
                    <span className="font-bold text-red-300">
                      {stats.max_hp}
                    </span>
                  </div>

                  <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, stats.max_hp)}%` }}
                    />
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-300">
                      Energía
                    </span>
                    <span className="font-bold text-blue-300">
                      {stats.max_ap}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, stats.max_ap)}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loadingClass !== null}
                  onClick={() => createCharacter(classCard.className)}
                  className={`w-full rounded-xl border border-yellow-300/40 bg-gradient-to-r px-5 py-3 font-black uppercase tracking-wide text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${classCard.buttonClass}`}
                >
                  {isLoading ? "Creando..." : "Elegir"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
