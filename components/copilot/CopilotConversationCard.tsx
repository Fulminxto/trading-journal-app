import { sendCopilotMessage } from "@/app/accounts/[accountId]/copilot/actions";

type Message = {
  id: string;
  role: string;
  content: string;
};

type Props = {
  copilotMessages: Message[];
  accountId: string;
};

export default function CopilotConversationCard({
  copilotMessages,
  accountId,
}: Props) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            AI Conversation
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            VOLTIS Assistant
          </h2>
        </div>

        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-400">
          Online
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {copilotMessages.length === 0 ? (
          <div className="max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm leading-relaxed text-gray-300">
              Ciao, sono VOLTIS Copilot. Scrivimi una domanda sul tuo account, sulla tua performance o sui tuoi pattern operativi.
            </p>
          </div>
        ) : (
          copilotMessages.map((message) => (
            <div
              key={message.id}
              className={`max-w-2xl rounded-[28px] border p-5 ${
                message.role === "user"
                  ? "ml-auto border-cyan-500/20 bg-cyan-500/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <p
                className={`text-sm leading-relaxed ${
                  message.role === "user"
                    ? "text-cyan-100"
                    : "text-gray-300"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        action={sendCopilotMessage}
        className="mt-8 flex items-center gap-4"
      >
        <input
          type="hidden"
          name="tradingAccountId"
          value={accountId}
        />

        <input
          type="text"
          name="content"
          placeholder="Ask VOLTIS Copilot..."
          className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none placeholder:text-gray-500"
        />

        <button className="h-14 rounded-2xl bg-cyan-500 px-6 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-cyan-400">
          Send
        </button>
      </form>
    </div>
  );
}
