/**
 * Site-wide configuration. Edit this file to connect services.
 * Nothing here is secret — server secrets live in environment variables (see .env.example).
 */
export const site = {
  name: "Ground & Mother",
  /** Set NEXT_PUBLIC_SITE_URL in production so canonical URLs, sitemap and Open Graph tags are correct. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  /** Social profiles. Empty values are hidden. */
  social: {
    instagram: "",
    pinterest: "",
    youtube: "",
  },

  /** Contact address shown in the footer. Leave empty to hide. */
  contactEmail: "",

  /**
   * Newsletter. No provider is connected yet, so the form is shown but does NOT collect addresses.
   * To connect one, set `provider` and `formAction` (the provider's form POST endpoint, e.g. a
   * Buttondown, Kit or MailerLite embed URL) and `emailField` (the input name it expects).
   */
  newsletter: {
    provider: null as null | string,
    formAction: "",
    emailField: "email",
  },

  gumroad: {
    /** The official overlay script. Loaded once, globally, only when at least one product is purchasable. */
    scriptSrc: "https://gumroad.com/js/gumroad.js",
  },
} as const;

export const newsletterEnabled = Boolean(site.newsletter.provider && site.newsletter.formAction);
