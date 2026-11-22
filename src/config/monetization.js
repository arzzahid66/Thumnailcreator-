/**
 * Monetization configuration — PLACEHOLDERS ONLY.
 *
 * Nothing here charges users or loads real ads yet. Flip flags / fill IDs
 * when the product is ready to earn. See README "Monetization roadmap".
 */

export const monetization = {
  // --- Advertising (Google AdSense) -------------------------------------
  // 1. Get approved at https://adsense.google.com and paste the publisher ID.
  // 2. Create ad units in AdSense and paste each slot ID below.
  // 3. Set `adsEnabled: true`. Until then <AdSlot /> renders nothing
  //    (or a subtle placeholder when `showAdPlaceholders` is true in dev).
  adsEnabled: false,
  showAdPlaceholders: false,
  adsenseClientId: '', // e.g. 'ca-pub-XXXXXXXXXXXXXXXX'
  adSlots: {
    header: '', // slot id for a leaderboard under the top bar
    sidebar: '', // slot id for the right-hand rail
    footer: '', // slot id above the footer
  },

  // --- Premium tier (future) --------------------------------------------
  // Planned: free tier keeps full editor + PNG/JPG export (no watermark).
  // Premium ideas: HD/4K export, premium templates, cloud saves, brand kits.
  // NO payment code exists yet — do not add Stripe/Paddle keys here in the
  // client bundle; payments must go through a backend / hosted checkout.
  premiumEnabled: false,
  premium: {
    priceMonthlyUsd: null, // TBD
    features: ['4k-export', 'premium-templates', 'cloud-saves', 'brand-kit'],
  },
}

export default monetization
