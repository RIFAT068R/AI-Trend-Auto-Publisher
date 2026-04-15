import Image from "next/image";
import type { HeadlineLayout, PosterTemplate } from "@/lib/types";

type PosterProps = {
  imageUrl: string;
  hook: string;
  subheadline?: string;
  category: string;
  template?: PosterTemplate;
  headlineLayout?: HeadlineLayout;
  colorMood?: string;
  designStyle?: string;
  alt?: string;
  className?: string;
};

function getBalancedHookLines(hook: string) {
  const words = hook.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 3) {
    return [hook];
  }

  const lineCount = Math.min(4, Math.max(2, Math.ceil(words.length / 3)));
  const wordsPerLine = Math.ceil(words.length / lineCount);
  const lines: string[] = [];

  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(words.slice(index, index + wordsPerLine).join(" "));
  }

  return lines.slice(0, 4);
}

export function Poster({ imageUrl, hook, subheadline, category, template = "template-a", headlineLayout = "top-left", colorMood = "blue-tech", designStyle = "premium ad poster", alt, className }: PosterProps) {
  const hookLines = getBalancedHookLines(hook);

  return (
    <div className={`poster-shell ${template} ${headlineLayout} mood-${colorMood.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()} ${className ?? ""}`.trim()}>
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
      <div className="poster-vignette" aria-hidden="true" />
      <div className="poster-spotlight" aria-hidden="true" />
      <div className="poster-safe-zone" aria-hidden="true" />
      <div className="poster-noise" aria-hidden="true" />
      <div className="poster-content">
        <div className="poster-topline">
          <span className="poster-badge">{category}</span>
          <span className="poster-style-chip">{designStyle}</span>
        </div>
        <div className="poster-copy">
          <h3 className={`poster-hook lines-${hookLines.length}`}>
            {hookLines.map((line) => (
              <span key={line} className="poster-hook-line">
                {line}
              </span>
            ))}
          </h3>
          {subheadline ? <p className="poster-subheadline">{subheadline}</p> : null}
        </div>
      </div>
    </div>
  );
}
