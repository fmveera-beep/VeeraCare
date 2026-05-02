/** Wave silhouette transitioning career brand band into black footer */
export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative z-[2] block h-[52px] w-full overflow-hidden leading-none md:h-[60px] ${className}`}
      aria-hidden
    >
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-black"
        viewBox="0 0 1440 54"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 54 L0 26 Q240 8 480 26 T960 26 T1440 26 L1440 54 Z"
        />
      </svg>
    </div>
  );
}
