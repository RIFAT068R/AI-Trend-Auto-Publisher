type CardProps = Readonly<{
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}>;

export function Card({ title, description, eyebrow, className, children }: CardProps) {
  return (
    <section className={`card glass-panel ${className ?? ""}`.trim()}>
      <div className="card-header">
        <div className="card-copy">
          {eyebrow ? <span className="card-eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}
