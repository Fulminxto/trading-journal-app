import { ShieldAlert } from "lucide-react";

import GlobalToast from "@/components/GlobalToast";
import { submitAccountReview } from "./actions";

export default async function AccountReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>;
}) {
  const query = await searchParams;

  return (
    <>
      <GlobalToast status={query.toast} />

      <div className="flex min-h-screen items-center justify-center bg-[#050b10] p-8 text-white">
        <form
          action={submitAccountReview}
          className="w-full max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 backdrop-blur-xl"
        >
          <ShieldAlert className="text-yellow-300" size={38} />

          <p className="mt-8 text-sm uppercase tracking-[0.25em] text-yellow-300">
            Account Review
          </p>

          <h1 className="mt-4 text-5xl font-black">
            Richiedi assistenza
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-gray-300">
            Usa questo modulo solo se il tuo account è stato sospeso e vuoi
            richiedere una revisione.
          </p>

          <input
            name="username"
            required
            placeholder="Il tuo username"
            className="mt-8 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <textarea
            name="message"
            required
            rows={6}
            placeholder="Spiega il problema o il motivo della richiesta..."
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
          >
            Invia richiesta
          </button>
        </form>
      </div>
    </>
  );
}