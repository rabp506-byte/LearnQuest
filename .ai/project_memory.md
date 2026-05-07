# Project Memory

## Infraestructura

- La conexión oficial con Supabase está lista mediante el cliente compartido en `src/lib/supabase.ts`.
- Las variables públicas necesarias para conectar la aplicación son `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, documentadas en `.env.local.example`.
- Se han aplicado políticas RLS en la base de datos para proteger el acceso a los datos del proyecto.
