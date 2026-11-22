import { monetization } from '../config/monetization'

/**
 * Ad placeholder component. Renders NOTHING while ads are disabled.
 * When monetization.adsEnabled is true and an AdSense client/slot id is
 * configured, this is where the <ins class="adsbygoogle"> tag will go.
 * No fake ads are ever shown.
 */
export default function AdSlot({ slot = 'header', className = '' }) {
  if (!monetization.adsEnabled) {
    if (!monetization.showAdPlaceholders) return null
    return <div className={`ad-placeholder ${className}`}>Ad slot: {slot} (disabled)</div>
  }
  // TODO (monetization): inject AdSense script in index.html and render the
  // real <ins> unit here using monetization.adsenseClientId + adSlots[slot].
  return null
}
