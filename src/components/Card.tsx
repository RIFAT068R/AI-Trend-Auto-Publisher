type CardProps = Readonly<{
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
}>;

export function Card({ title, description, eyebrow, className, headerSlot, children }: CardProps) {
  return (
    <section className={`card glass-panel ${className ?? ""}`.trim()}>
      <div className="card-header">
        <div className="card-copy">
          {eyebrow ? <span className="card-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {headerSlot ? <div className="card-header-slot">{headerSlot}</div> : null}
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}
