export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5",
    md: "text-xs px-5 py-3 gap-2.5",
    lg: "text-sm px-7 py-4 gap-3",
    icon: "p-2.5 rounded-xl",
  };

  const variantStyles = {
    primary:
      "bg-[#b8ff32] text-[#070908] hover:bg-[#c9ff4d] hover:shadow-[0_0_20px_rgba(184,255,50,0.4)] active:scale-[0.98]",
    secondary:
      "bg-white/10 text-white hover:bg-white/15 border border-white/10 active:scale-[0.98]",
    dark:
      "bg-[#101411] text-white hover:bg-[#181f1a] border border-white/10 active:scale-[0.98]",
    outline:
      "bg-transparent text-white border border-white/20 hover:border-[#b8ff32] hover:text-[#b8ff32] active:scale-[0.98]",
    ghost:
      "bg-transparent text-white/70 hover:text-white hover:bg-white/5 active:scale-[0.98]",
    danger:
      "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon size={size === "lg" ? 18 : 15} className="shrink-0" />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon size={size === "lg" ? 18 : 15} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
