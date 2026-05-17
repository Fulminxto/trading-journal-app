"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/accounts",
    });

    if (result?.error) {
      setError("Username o password non corretti.");
      return;
    }

    window.location.href = "/accounts";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="username"
        placeholder="Username"
        className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
        required
      />

      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 pr-12 outline-none transition placeholder:text-gray-600 focus:border-green-500/50 focus:bg-black/40"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-500/10 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400"
      >
        Login
      </button>
    </form>
  );
}