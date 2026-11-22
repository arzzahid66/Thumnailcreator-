// Minimal undo/redo history over immutable JSON snapshots of the scene.
export function createHistory(initial) {
  return { past: [], present: initial, future: [] }
}
export function pushHistory(h, next) {
  return { past: [...h.past.slice(-49), h.present], present: next, future: [] }
}
export function undoHistory(h) {
  if (!h.past.length) return h
  const prev = h.past[h.past.length - 1]
  return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] }
}
export function redoHistory(h) {
  if (!h.future.length) return h
  const [next, ...rest] = h.future
  return { past: [...h.past, h.present], present: next, future: rest }
}
export const clone = (v) => JSON.parse(JSON.stringify(v))
