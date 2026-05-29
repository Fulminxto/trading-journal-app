import { ShieldAlert } from "lucide-react";

export default function FrozenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b10] p-8 text-white">
      <div className="max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-yellow-500/20 bg-yellow-500/10">
          <ShieldAlert
            size={34}
            className="text-yellow-300"
          />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-yellow-300">
          Account Frozen
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Accesso temporaneamente sospeso
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-gray-300">
          Il tuo accesso a VOLTIS è stato temporaneamente
          sospeso dall’amministratore. Contatta il supporto
          per maggiori informazioni.
        </p>
      </div>
    </div>
  );
}