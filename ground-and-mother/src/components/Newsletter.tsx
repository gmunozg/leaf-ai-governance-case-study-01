import { site, newsletterEnabled } from "@/content/site";
import type { Dictionary } from "@/i18n/dictionary";
import { Arrow } from "./Arrow";

/**
 * Newsletter invitation. With no provider configured in content/site.ts the form is shown
 * disabled with an honest note — no addresses are collected. Once `formAction` is set it
 * posts directly to the provider; nothing passes through this site.
 */
export function Newsletter({ dict }: { dict: Dictionary }) {
  const n = dict.newsletter;
  return (
    <section id="letter" className="section band-oat" aria-labelledby="letter-title">
      <div className="wrap letter">
        <div className="stack">
          <p className="label clay" data-reveal>{n.kicker}</p>
          <h2 id="letter-title" className="display" data-reveal>{n.title}</h2>
          <p className="lede muted prose" data-reveal>{n.body}</p>
        </div>
        <form
          action={newsletterEnabled ? site.newsletter.formAction : undefined}
          method={newsletterEnabled ? "post" : undefined}
          target={newsletterEnabled ? "_blank" : undefined}
          data-reveal
          aria-describedby="letter-note"
        >
          <label htmlFor="letter-email" className="label">{n.label}</label>
          <div className="letter__field">
            <input id="letter-email" type="email" name={site.newsletter.emailField} autoComplete="email" placeholder={n.placeholder} required disabled={!newsletterEnabled} />
            <button className="btn" type="submit" disabled={!newsletterEnabled}>
              <span>{newsletterEnabled ? n.submit : n.notOpenButton}</span>
              {newsletterEnabled ? <Arrow /> : null}
            </button>
          </div>
          <p id="letter-note" className="buybox__note">{newsletterEnabled ? n.privacy : n.notOpen}</p>
        </form>
      </div>
    </section>
  );
}
