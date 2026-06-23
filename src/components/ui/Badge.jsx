export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#00B7FF] text-black",
    success: "bg-[#7AE582] text-black",
    warning: "bg-[#FFD23F] text-black",
    danger: "bg-[#FF595E] text-white",
    pink: "bg-[#FF5D8F] text-white",
  };

  return (
    <span
      className={`inline-block border-2 border-black px-3 py-1 text-sm font-bold shadow-[2px_2px_0_black] ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
