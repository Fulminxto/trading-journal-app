type SignatureEdgeProps = {
  orientation?: "vertical" | "horizontal";
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * The one "alive" line in an otherwise calm surface — cyan->blue signature
 * edge used on hero sections and the sidebar's active-item indicator.
 * Never glows at rest anywhere else; this is the deliberate exception.
 */
export default function SignatureEdge({
  orientation = "vertical",
  pulse = true,
  className = "",
  style,
}: SignatureEdgeProps) {
  const sizeCls =
    orientation === "vertical" ? "h-full w-[3px]" : "h-[3px] w-full";

  const gradientCls =
    orientation === "vertical"
      ? "bg-gradient-to-b from-accent-bright to-accent"
      : "bg-gradient-to-r from-accent-bright to-accent";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none block rounded-full ${sizeCls} ${gradientCls} ${
        pulse ? "animate-signature-pulse" : ""
      } ${className}`.trim()}
      style={style}
    />
  );
}
