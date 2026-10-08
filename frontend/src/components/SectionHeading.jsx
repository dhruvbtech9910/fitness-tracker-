export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = "left",
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl ${
        isCenter ? "mx-auto text-center" : ""
      } ${className}`}
    >
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff32] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
            {badge}
          </span>
        </div>
      )}

      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-[-0.04em] leading-[0.95] text-white">
        {title}{" "}
        {highlight && (
          <span className="text-[#b8ff32] drop-shadow-[0_0_20px_rgba(184,255,50,0.3)]">
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
