export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center border-4 border-black bg-[#FFD23F] px-5 py-3 font-extrabold text-black shadow-[6px_6px_0_black] transition-transform duration-150 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}