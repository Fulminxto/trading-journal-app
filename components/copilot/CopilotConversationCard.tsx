import { sendCopilotMessage } from "@/app/accounts/[accountId]/copilot/actions";
import {
  getCopilotLabels,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";
import Card from "@/components/ui/Card";
import { SendHorizontal } from "lucide-react";

type Message = {
  id: string;
  role: string;
  content: string;
};

type Props = CopilotI18nProps & {
  copilotMessages: Message[];
  accountId: string;
  hasContext: boolean;
};

export default function CopilotConversationCard({
  copilotMessages,
  accountId,
  appLanguage,
  hasContext,
}: Props) {
  const t = getCopilotLabels(appLanguage);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-bright">
            {t.components.conversation.eyebrow}
          </p>
          <h2 className="mt-3 text-section text-white">
            {t.components.conversation.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            This conversation is rule-based and account-scoped. It can review
            logged trades and operating memory, but it will not infer market
            predictions or hidden data.
          </p>
        </div>

        <span
          className={`rounded-pill border-[0.5px] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] ${
            hasContext
              ? "border-accent-bright/20 bg-accent-bright/[0.06] text-accent-bright"
              : "border-warning/25 bg-warning/[0.06] text-warning"
          }`}
        >
          {hasContext ? t.common.online : "Limited"}
        </span>
      </div>

      <div className="mt-8 space-y-4">
        {copilotMessages.length === 0 ? (
          <Card variant="inner" className="max-w-2xl p-5">
            <p className="text-sm leading-relaxed text-gray-300">
              {hasContext
                ? t.components.conversation.emptyMessage
                : "Add more trade history before relying on Copilot answers. You can still ask process questions, but the response will stay conservative."}
            </p>
          </Card>
        ) : (
          copilotMessages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <Card
                  variant="inner"
                  className={`max-w-2xl p-5 ${
                    isUser
                      ? "border-accent-bright/20 bg-accent-bright/[0.06]"
                      : ""
                  }`}
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-faint">
                    {isUser ? "You" : "VOLTIS"}
                  </p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {message.content}
                  </p>
                </Card>
              </div>
            );
          })
        )}
      </div>

      <form
        action={sendCopilotMessage}
        className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <input
          type="hidden"
          name="tradingAccountId"
          value={accountId}
        />
        <input
          type="text"
          name="content"
          placeholder={t.components.conversation.placeholder}
          className="h-12 rounded-inner border-[0.5px] border-flash/[0.1] bg-surface-2 px-4 text-sm text-white outline-none transition-all duration-base placeholder:text-muted-faint focus:border-accent-bright/45 focus:ring-2 focus:ring-accent-bright/10"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-inner bg-[linear-gradient(120deg,var(--color-accent),#3f86e8_60%,var(--color-accent-bright))] px-5 text-sm font-semibold text-white transition-all duration-fast hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(52,168,255,0.12)]"
        >
          <SendHorizontal size={16} />
          {t.components.conversation.send}
        </button>
      </form>
    </Card>
  );
}
