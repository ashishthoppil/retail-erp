export default function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed right-6 top-6 z-50 rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-white shadow-lg">
      {message}
    </div>
  );
}
