# LearnQuest

LearnQuest es la evolución autónoma de Classcraft: una plataforma educativa gamificada que transforma el aprendizaje en una aventura colaborativa, adaptable y guiada por inteligencia artificial.

El proyecto busca combinar mecánicas de rol, progreso académico, narrativa emergente y automatización inteligente para ayudar a docentes y estudiantes a construir experiencias de aprendizaje más motivadoras, medibles y sostenibles.

## Estado actual

LearnQuest está actualmente en modo **local-first** para facilitar pruebas rápidas en Codespaces o en desarrollo local.

- No usa Supabase todavía.
- No usa autenticación todavía.
- No requiere Vercel ni variables de entorno para probar el flujo principal.
- Los personajes se guardan temporalmente en `localStorage`.
- El objetivo actual es probar mecánicas, UI y flujo de juego local antes de reconectar infraestructura externa.

## Flujo local

1. El usuario abre la app.
2. `src/app/page.tsx` revisa si existe un personaje en `localStorage`.
3. Si no hay personaje, se muestra `ClassSelector`.
4. Al elegir clase, se crea un personaje local y se guarda en `localStorage`.
5. La página actualiza el estado inmediatamente y muestra `CharacterStatus`.

## Estructura activa

- `src/app/page.tsx`: orquesta el flujo local de juego.
- `src/components/ClassSelector.tsx`: crea personajes locales por clase.
- `src/components/CharacterStatus.tsx`: muestra estadísticas del personaje.
- `src/lib/game-logic.ts`: define tipos, constantes y lógica base del juego.
- `src/lib/local-storage.ts`: guarda, carga y limpia personajes en `localStorage`.
- `docs/mechanics.md`: documentación de mecánicas de juego, aprendizaje y progresión.

## Pausado para una fase futura

La integración de Supabase, autenticación, variables de entorno y esquema SQL se movió a `docs/future-supabase/` para evitar dependencias remotas durante la demo local.
