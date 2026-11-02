import Image from "next/image";
import type { Image as Img, Tone } from "@/content/products";
import type { Locale } from "@/i18n/config";
import { StillLife, toneMotif, type Motif } from "./StillLife";

type Props = {
  image?: Img | null;
  tone: Tone;
  locale: Locale;
  /** Art-direction brief shown on the placeholder — what the real photograph should be. */
  brief?: string;
  placeholderLabel: string;
  ratio?: "portrait" | "tall" | "land" | "wide" | "square";
  className?: string;
  sizes?: string;
  priority?: boolean;
  reveal?: boolean;
  delay?: number;
  compact?: boolean;
  /** Which still life the placeholder draws; defaults to the tone's motif. */
  motif?: Motif;
};

/**
 * Photography slot. Renders the real photograph when one is configured, otherwise a clearly
 * labelled placeholder that carries the art-direction brief — never passed off as brand photography.
 */
export function Media({ image, tone, locale, brief, placeholderLabel, ratio = "portrait", className = "", sizes = "100vw", priority, reveal = true, delay = 0, compact, motif }: Props) {
  return (
    <div
      className={`media ratio-${ratio} ${className}`}
      data-reveal={reveal ? "image" : undefined}
      style={delay ? ({ "--d": delay } as React.CSSProperties) : undefined}
    >
      <div className="media-inner">
        {image ? (
          <Image src={image.src} alt={image.alt[locale]} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
        ) : (
          <div className={`ph ph--${tone}${compact ? " ph--compact" : ""}`} role="img" aria-label={`${placeholderLabel}${brief ? `: ${brief}` : ""}`}>
            <StillLife className="ph__still" motif={motif ?? toneMotif[tone]} />
            <div className="ph__label" aria-hidden="true">
              <span className="label">{placeholderLabel}</span>
              {brief ? <span className="ph__brief">{brief}</span> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
