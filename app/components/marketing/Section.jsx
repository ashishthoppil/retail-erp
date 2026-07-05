export function SectionHeading({ eyebrow, title, sub, align = "center" }) {
  const alignClasses =
    align === "left" ? "max-w-2xl text-left" : "mx-auto max-w-2xl text-center";
  return (
    <div className={alignClasses}>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {sub ? (
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{sub}</p>
      ) : null}
    </div>
  );
}

export default function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}
