export default function Card({ children }) {
  return (
    <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_black]">
      {children}
    </div>
  );
}