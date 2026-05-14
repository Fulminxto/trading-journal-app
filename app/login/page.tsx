import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/accounts");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b10] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Trading Platform
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Accedi alla tua piattaforma privata.
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
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none transition focus:border-green-500"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none transition focus:border-green-500"
            required
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}