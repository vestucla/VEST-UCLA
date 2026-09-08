export const siteConfig = {
  name: "VEST at UCLA",
  tagline: "Scaling builder culture at UCLA.",

  /** Flip to true to show every "apply" call to action across the site. */
  applicationsOpen: false,
  /**
   * Shown on /join while applications are closed. Leave empty to fall back
   * to the generic "check back next quarter" copy.
   */
  applicationsOpenAt: "September 21 at 12 PM",
  applicationUrl: "https://vestucla.typeform.com/to/placeholder", // TODO: real form URL

  /** LA Tech Week showcase, surfaced on the home and events pages. */
  techWeek: {
    title: "We’re hosting for LA Tech Week",
    description:
      "VEST is bringing founders, builders and investors together for a live product showcase during LA Tech Week. Apply to demo what you’re building, or RSVP to come watch.",
    demoApplicationUrl: "https://vestucla.typeform.com/to/placeholder", // TODO: real demo form URL
    rsvpUrl: "https://vestucla.typeform.com/to/placeholder", // TODO: real RSVP URL
  },

  links: {
    discord: "https://discord.gg/PTGgbFvm9t",
    email: "mailto:vestucla@gmail.com",
    instagram: "https://www.instagram.com/vestucla/",
    linkedin: "https://www.linkedin.com/company/vest-ucla/",
    newsletter:
      "https://vestucla.us13.list-manage.com/subscribe/post?u=65d6dbbacd1e7ab2cebe3bc5c&id=aa4fd52c38",
    x: "https://twitter.com/vestucla",
  },
} as const;
