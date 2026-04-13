type CardProps = Readonly<{
  title: string;
  description?: string;
  eyebrow?: string;
  children: React.ReactNode;
}>;

export function Card({ title, description, eyebrow, children }: CardProps) {
  return (
    <section className="card reveal-up">
      <div className="card-header">
        <div className="card-copy">
          {eyebrow ? <span className="badge">{eyebrow}</span> : null}
          <h2 className="section-title">{title}</h2>
          {description ? <p className="card-description">{description}</p> : null}
        </div>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}
