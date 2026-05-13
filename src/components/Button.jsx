export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}) {
  const baseClass = "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed";

  const variantClass = {
    primary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-300",
    secondary: "border border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400",
    tertiary: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:text-slate-400",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
