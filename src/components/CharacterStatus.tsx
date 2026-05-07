import type { Character } from "@/lib/game-logic";
import { xpRequiredForLevel } from "@/lib/game-logic";

interface CharacterStatusProps {
  character: Character;
  studentName: string;
}

const CLASS_LABELS: Record<Character["class"], string> = {
  guerrero: "Guerrero",
  mago: "Mago",
  curandero: "Curandero",
};

const CLASS_BADGE_STYLES: Record<Character["class"], string> = {
  guerrero: "from-red-600 to-orange-500",
  mago: "from-blue-600 to-indigo-500",
  curandero: "from-emerald-600 to-teal-500",
};

function getPercentage(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (current / max) * 100));
}

function StatBar({
  label,
  value,
  max,
  barClassName,
}: {
  label: string;
  value: number;
  max: number;
  barClassName: string;
}) {
  const percentage = getPercentage(value, max);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm font-medium text-slate-200">
        <span>{label}</span>
        <span>
          {value} / {max}
        </span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function CharacterStatus({
  character,
  studentName,
}: CharacterStatusProps) {
  const nextLevelXp = xpRequiredForLevel(character.level);
  const xpPercentage = getPercentage(character.xp, nextLevelXp);

  return (
    <section className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-lg">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{studentName}</h2>

          <div
            className={`mt-2 inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold shadow-md ${
              CLASS_BADGE_STYLES[character.class]
            }`}
          >
            {CLASS_LABELS[character.class]}
          </div>
        </div>

        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-yellow-300/40 bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 shadow-lg">
          <span className="text-xs font-bold uppercase leading-none">Nivel</span>
          <span className="text-2xl font-black leading-none">
            {character.level}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <StatBar
          label="HP"
          value={character.hp}
          max={character.max_hp}
          barClassName="bg-gradient-to-r from-red-700 via-red-500 to-rose-400"
        />

        <StatBar
          label="AP"
          value={character.ap}
          max={character.max_ap}
          barClassName="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400"
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm font-medium text-slate-200">
            <span>XP</span>
            <span>
              {character.xp} / {nextLevelXp}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-yellow-400 transition-all duration-700 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white/5 p-3 shadow-inner">
          <p className="text-xs uppercase text-slate-400">Gold</p>
          <p className="text-lg font-bold text-yellow-300">{character.gold}</p>
        </div>

        <div className="rounded-xl bg-white/5 p-3 shadow-inner">
          <p className="text-xs uppercase text-slate-400">PP</p>
          <p className="text-lg font-bold text-purple-300">{character.pp}</p>
        </div>

        <div className="rounded-xl bg-white/5 p-3 shadow-inner">
          <p className="text-xs uppercase text-slate-400">Clase</p>
          <p className="text-sm font-bold text-slate-100">
            {CLASS_LABELS[character.class]}
          </p>
        </div>
      </div>
    </section>
  );
}
