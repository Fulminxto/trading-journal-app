"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black shadow-[0_0_30px_rgba(34,197,94,0.18)] transition hover:bg-green-400"
      >
        Login
      </button>
    </form>
  );
}