import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Zap } from "lucide-react";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/accounts");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050b10] px-4 text-white">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.10),transparent_34%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
            <Zap
              size={26}
              strokeWidth={2.3}
              className="text-white"
            />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.45em] text-gray-500">
            VOLTIS
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Sign in to access your account.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
