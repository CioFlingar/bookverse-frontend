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
  const baseClass = "font-semibold rounded transition-colors duration-200 flex items-center justify-center gap-2";

  const variantClass = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-gray-400",
    secondary: "border border-slate-900 text-slate-900 hover:bg-slate-50 disabled:border-gray-400",
    tertiary: "text-slate-600 hover:text-slate-900 hover:underline disabled:text-gray-400",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
    >
      {loading ? <span className="animate-spin">⏳</span> : null}
      {children}
    </button>
  );
}
