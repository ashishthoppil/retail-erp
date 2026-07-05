export default function Card({
  as: Tag = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
