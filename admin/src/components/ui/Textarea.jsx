export default function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full border-4 border-black bg-white px-4 py-3 font-medium outline-none shadow-[4px_4px_0_black] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none ${props.className || ""}`}
    />
  );
}
