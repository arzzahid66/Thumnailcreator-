// The 8 built-in templates. Each template = background + starter layers.
// Layer coords are in a 1280x720 space; the editor scales them when the
// canvas size changes. Layer factory helpers keep templates readable.

let seq = 0
const id = () => `layer-${Date.now()}-${seq++}`

export const textLayer = (text, x, y, opts = {}) => ({
  id: id(), type: 'text', text, x, y,
  fontSize: 84, fontFamily: 'Anton', color: '#ffffff',
  strokeColor: '#000000', strokeWidth: 0, shadow: true,
  align: 'left', rotation: 0, opacity: 1, ...opts,
})
export const shapeLayer = (shape, x, y, w, h, opts = {}) => ({
  id: id(), type: 'shape', shape, x, y, width: w, height: h,
  color: '#ff3355', rotation: 0, opacity: 1, ...opts,
})
export const badgeLayer = (text, x, y, opts = {}) => ({
  id: id(), type: 'badge', text, x, y, fontSize: 36,
  fontFamily: 'Montserrat', color: '#ffffff', bg: '#e11d48',
  rotation: 0, opacity: 1, ...opts,
})
export const stickerLayer = (emoji, x, y, opts = {}) => ({
  id: id(), type: 'sticker', text: emoji, x, y, fontSize: 110,
  rotation: 0, opacity: 1, ...opts,
})

const grad = (c1, c2, angle = 135) => ({ type: 'gradient', color1: c1, color2: c2, angle })
const solid = (c) => ({ type: 'solid', color1: c, color2: c, angle: 0 })

export const TEMPLATES = [
  {
    id: 'gaming', name: 'Gaming', category: 'YouTube',
    background: grad('#1a0533', '#ff2e63', 120),
    layers: () => [
      badgeLayer('NEW VIDEO', 56, 48, { bg: '#ff2e63' }),
      textLayer('EPIC WIN!', 56, 400, { fontSize: 130, color: '#ffe600', strokeColor: '#000', strokeWidth: 8 }),
      textLayer('You Won’t Believe This…', 60, 540, { fontSize: 52, fontFamily: 'Montserrat' }),
      stickerLayer('🔥', 1060, 90, { fontSize: 150 }),
    ],
  },
  {
    id: 'tutorial', name: 'Tutorial', category: 'Education',
    background: grad('#0f2027', '#2c5364', 135),
    layers: () => [
      badgeLayer('STEP BY STEP', 56, 48, { bg: '#22c55e' }),
      textLayer('LEARN REACT', 56, 330, { fontSize: 120, color: '#ffffff', strokeWidth: 6, strokeColor: '#000' }),
      textLayer('IN 10 MINUTES', 56, 470, { fontSize: 110, color: '#4ade80', strokeWidth: 6, strokeColor: '#000' }),
      stickerLayer('💻', 1040, 420, { fontSize: 170 }),
    ],
  },
  {
    id: 'vlog', name: 'Vlog', category: 'Lifestyle',
    background: grad('#f7971e', '#ffd200', 120),
    layers: () => [
      textLayer('MY DAILY', 56, 260, { fontSize: 118, color: '#111827', shadow: false }),
      textLayer('VLOG ✦ 24 HOURS', 56, 400, { fontSize: 92, fontFamily: 'Bebas Neue', color: '#ffffff', strokeWidth: 5, strokeColor: '#111827' }),
      badgeLayer('WATCH NOW', 60, 540, { bg: '#111827' }),
      stickerLayer('🎥', 1060, 80, { fontSize: 140 }),
    ],
  },
  {
    id: 'tech', name: 'Tech Review', category: 'Tech',
    background: grad('#0b1220', '#2563eb', 135),
    layers: () => [
      badgeLayer('REVIEW 2026', 56, 48, { bg: '#2563eb' }),
      textLayer('WORTH IT?', 56, 380, { fontSize: 132, color: '#ffffff', strokeWidth: 8, strokeColor: '#000' }),
      textLayer('Honest Review — No Hype', 60, 540, { fontSize: 50, fontFamily: 'Montserrat', color: '#bfdbfe' }),
      stickerLayer('📱', 1070, 100, { fontSize: 150 }),
    ],
  },
  {
    id: 'podcast', name: 'Podcast', category: 'Audio',
    background: grad('#2d1b4e', '#7c3aed', 135),
    layers: () => [
      stickerLayer('🎙️', 70, 90, { fontSize: 150 }),
      textLayer('THE SHOW', 56, 380, { fontSize: 122, fontFamily: 'Bebas Neue', color: '#ffffff', strokeWidth: 6, strokeColor: '#000' }),
      textLayer('EP. 42 — Special Guest', 60, 520, { fontSize: 52, fontFamily: 'Montserrat', color: '#ddd6fe' }),
      badgeLayer('LISTEN NOW', 950, 56, { bg: '#7c3aed' }),
    ],
  },
  {
    id: 'fitness', name: 'Fitness', category: 'Health',
    background: grad('#052e16', '#16a34a', 120),
    layers: () => [
      badgeLayer('30 DAY CHALLENGE', 56, 48, { bg: '#16a34a' }),
      textLayer('GET FIT', 56, 360, { fontSize: 138, color: '#ffffff', strokeWidth: 8, strokeColor: '#052e16' }),
      textLayer('FAST — AT HOME', 56, 510, { fontSize: 96, color: '#facc15', strokeWidth: 6, strokeColor: '#052e16' }),
      stickerLayer('💪', 1060, 420, { fontSize: 160 }),
    ],
  },
  {
    id: 'finance', name: 'Finance', category: 'Money',
    background: grad('#111827', '#b45309', 135),
    layers: () => [
      badgeLayer('MONEY TIPS', 56, 48, { bg: '#d97706' }),
      textLayer('$10K / MONTH', 56, 370, { fontSize: 124, color: '#fbbf24', strokeWidth: 8, strokeColor: '#000' }),
      textLayer('How I Did It (Real Numbers)', 60, 530, { fontSize: 50, fontFamily: 'Montserrat' }),
      stickerLayer('📈', 1070, 90, { fontSize: 150 }),
    ],
  },
  {
    id: 'minimal', name: 'Minimal', category: 'Clean',
    background: solid('#f8fafc'),
    layers: () => [
      textLayer('Less, but better.', 64, 300, { fontSize: 96, fontFamily: 'Montserrat', color: '#0f172a', shadow: false }),
      textLayer('A clean thumbnail that stands out', 68, 420, { fontSize: 44, fontFamily: 'Montserrat', color: '#475569', shadow: false }),
      shapeLayer('rect', 68, 500, 220, 10, { color: '#0f172a' }),
    ],
  },
]

export const SIZE_PRESETS = [
  { id: 'yt', name: 'YouTube 1280×720', width: 1280, height: 720 },
  { id: 'hd', name: 'Full HD 1920×1080', width: 1920, height: 1080 },
  { id: 'square', name: 'Square 1080×1080', width: 1080, height: 1080 },
  { id: 'portrait', name: 'Portrait 1080×1350', width: 1080, height: 1350 },
]

export const FONTS = ['Anton', 'Bebas Neue', 'Montserrat', 'Inter', 'Arial', 'Georgia']
export const STICKERS = ['🔥', '⭐', '🚀', '💡', '🎯', '👀', '✅', '❤️', '😱', '🏆']
