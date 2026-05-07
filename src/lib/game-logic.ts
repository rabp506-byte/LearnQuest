export type UserRole = "student" | "teacher" | "admin";

export type CharacterClass = "guerrero" | "mago" | "curandero";

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Character {
  id: string;
  profile_id: string;

  hp: number;
  max_hp: number;

  xp: number;

  ap: number;
  max_ap: number;

  pp: number;

  level: number;

  class: CharacterClass;

  gold: number;

  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  class: CharacterClass;
  nombre: string;
  costo_ap: number;
  efecto: string;
  created_at: string;
}

export interface ClassBaseStats {
  hp: number;
  max_hp: number;
  ap: number;
  max_ap: number;
  pp: number;
}

export const GAME_CONSTANTS = {
  BASE_STATS: {
    guerrero: {
      hp: 90,
      max_hp: 90,
      ap: 40,
      max_ap: 40,
      pp: 0,
    },
    mago: {
      hp: 40,
      max_hp: 40,
      ap: 90,
      max_ap: 90,
      pp: 0,
    },
    curandero: {
      hp: 60,
      max_hp: 60,
      ap: 60,
      max_ap: 60,
      pp: 0,
    },
  } satisfies Record<CharacterClass, ClassBaseStats>,

  PROTECTION_AP_COST: 10,
} as const;

export function xpRequiredForLevel(level: number): number {
  if (!Number.isFinite(level) || level < 1) {
    throw new Error("Level must be a positive number.");
  }

  return Math.ceil(100 * Math.pow(level, 1.5));
}

export interface DamageResult {
  targetCharacterId: string;
  damageTaken: number;
  protectedByGuardian: boolean;
  guardianCharacterId?: string;
  guardianApCost?: number;
}

export function calculateDamage(params: {
  target: Character;
  damage: number;
  guardian?: Character | null;
  protectionApCost?: number;
}): DamageResult {
  const {
    target,
    damage,
    guardian,
    protectionApCost = GAME_CONSTANTS.PROTECTION_AP_COST,
  } = params;

  if (!Number.isFinite(damage) || damage < 0) {
    throw new Error("Damage must be a non-negative number.");
  }

  const canGuardianProtect =
    guardian !== null &&
    guardian !== undefined &&
    guardian.class === "guerrero" &&
    guardian.id !== target.id &&
    guardian.hp > 0 &&
    guardian.ap >= protectionApCost;

  if (canGuardianProtect) {
    return {
      targetCharacterId: guardian.id,
      damageTaken: Math.min(damage, guardian.hp),
      protectedByGuardian: true,
      guardianCharacterId: guardian.id,
      guardianApCost: protectionApCost,
    };
  }

  return {
    targetCharacterId: target.id,
    damageTaken: Math.min(damage, target.hp),
    protectedByGuardian: false,
  };
}

export function applyDamage(character: Character, damage: number): Character {
  if (!Number.isFinite(damage) || damage < 0) {
    throw new Error("Damage must be a non-negative number.");
  }

  return {
    ...character,
    hp: Math.max(0, character.hp - damage),
    updated_at: new Date().toISOString(),
  };
}

export function spendAp(character: Character, apCost: number): Character {
  if (!Number.isFinite(apCost) || apCost < 0) {
    throw new Error("AP cost must be a non-negative number.");
  }

  if (character.ap < apCost) {
    throw new Error("Not enough AP.");
  }

  return {
    ...character,
    ap: character.ap - apCost,
    updated_at: new Date().toISOString(),
  };
}
