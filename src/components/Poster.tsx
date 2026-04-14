import Image from "next/image";

type PosterProps = {
  imageUrl: string;
  hook: string;
  category: string;
  alt?: string;
  className?: string;
};

export function Poster({ imageUrl, hook, category, alt, className }: PosterProps) {
  return (
    <div className={`poster-shell ${className ?? ""}`.trim()}>
      <div className="poster-media">
        <Image
          src={imageUrl}
          alt={alt ?? hook}
          fill
          sizes="(max-width: 820px) 100vw, 420px"
          className="poster-image"
          unoptimized
        />
      </div>
      <div className="poster-overlay" />
      <div className="poster-noise" aria-hidden="true" />
      <div className="poster-content">
        <span className="poster-badge">{category}</span>
        <h3 className="poster-hook">{hook}</h3>
      </div>
    </div>
  );
}
