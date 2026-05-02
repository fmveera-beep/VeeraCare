type SawtoothDividerProps = {
  variant: "black-up" | "black-down";
  className?: string;
};

export function SawtoothDivider({ variant, className = "" }: SawtoothDividerProps) {
  const fill = variant === "black-up" ? "#000000" : "#000000";
  const flip = variant === "black-down";
  return (
    <div
      className={`relative w-full overflow-hidden leading-none ${className}`}
      aria-hidden
    >
      <svg
        className="relative block h-6 w-full md:h-8"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path
          fill={fill}
          d="M0 40 L50 10 L100 40 L150 10 L200 40 L250 10 L300 40 L350 10 L400 40 L450 10 L500 40 L550 10 L600 40 L650 10 L700 40 L750 10 L800 40 L850 10 L900 40 L950 10 L1000 40 L1050 10 L1100 40 L1150 10 L1200 40 L1200 0 L0 0 Z"
        />
      </svg>
    </div>
  );
}
