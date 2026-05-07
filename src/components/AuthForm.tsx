"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      if (isRegistering) {
        if (!username.trim()) {
          throw new Error("Please enter a username.");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        });

        if (error) throw error;

        setMessage("Account created. Please check your email to confirm it.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Login successful. Welcome back, adventurer.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-yellow-500/60 bg-gradient-to-br from-slate-900 via-stone-950 to-slate-900 p-8 shadow-2xl shadow-black/60">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/70 bg-slate-950 shadow-lg shadow-yellow-500/20">
            <span className="text-3xl">⚔</span>
          </div>

          <h1 className="text-3xl font-black tracking-wide text-yellow-300">
            LearnQuest
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            {isRegistering
              ? "Create your hero account"
              : "Enter the dungeon of learning"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-yellow-200"
              >
                Nombre de Usuario
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required={isRegistering}
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
                placeholder="Ejemplo: ShadowCoder"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-yellow-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-yellow-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              placeholder="Minimum 6 characters"
            />
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-yellow-400/70 bg-gradient-to-r from-yellow-700 via-yellow-500 to-amber-400 px-5 py-3 font-bold text-slate-950 shadow-lg transition hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Loading..."
              : isRegistering
                ? "Crear Cuenta"
                : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setMessage(null);
              setErrorMessage(null);
            }}
            className="text-sm font-medium text-slate-300 transition hover:text-yellow-300"
          >
            {isRegistering
              ? "¿Ya tienes una cuenta? Inicia sesión"
              : "¿Nuevo aventurero? Regístrate"}
          </button>
        </div>
      </div>
    </section>
  );
}
