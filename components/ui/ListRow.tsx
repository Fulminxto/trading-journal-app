import Link from "next/link";
import type { ReactNode } from "react";

type ListRowProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

const ROW_CLASS =
  "group block w-full rounded-inner border-[0.5px] border-transparent px-4 py-3 text-left transition-all duration-base hover:-translate-y-0.5 hover:border-accent-bright/40 hover:bg-white/[0.03]";

/**
 * Precious list row: cyan border + lift on hover, never aggressive.
 * Deliberately imposes no internal flex direction — a table row and a
 * stacked notification row need different internal layouts, this is
 * just the hoverable shell.
 */
export default function ListRow({
  href,
  onClick,
  children,
  className = "",
}: ListRowProps) {
  const cls = `${ROW_CLASS} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }

  return <div className={cls}>{children}</div>;
}
