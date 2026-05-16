import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Zap } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/accounts");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050b10] px-4 text-white">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-green-500/20 bg-green-500/10 shadow-[0_0_35px_rgba(34,197,94,0.18)]">
            <Zap
              size={30}
              className="text-green-400"
            />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gray-500">
            Private Desk
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Trading Journal
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Accedi al tuo spazio privato per analizzare trade,
            sessioni, performance e crescita operativa.
          </p>
        </div>

        <form
          action="/api/auth/callback/credentials"
          method="POST"
          className="space-y-4"
        >
          <input
            name="username"
            placeholder="Username"
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
            required
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400"
          >
            Accedi
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-xs leading-5 text-gray-500">
          Private performance analysis system.
          <br />
          Accesso riservato agli utenti autorizzati.
        </div>
      </div>
    </div>
  );
}