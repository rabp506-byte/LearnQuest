import type { Character } from "@/lib/game-logic";

const CHARACTER_STORAGE_KEY = "learnquest.character";

export function loadCharacterFromLocalStorage(): Character | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedCharacter = localStorage.getItem(CHARACTER_STORAGE_KEY);

  if (!storedCharacter) {
    return null;
  }

  try {
    return JSON.parse(storedCharacter) as Character;
  } catch (error) {
    console.error("[LearnQuest] Failed to parse local character", { error });
    localStorage.removeItem(CHARACTER_STORAGE_KEY);
    return null;
  }
}

export function saveCharacterToLocalStorage(character: Character): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
}

export function clearCharacterFromLocalStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(CHARACTER_STORAGE_KEY);
}
