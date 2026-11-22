import { SIZE_PRESETS } from '../data/templates'

export default function TopBar({ sizeId, onSize, onUndo, onRedo, canUndo, canRedo, onDownload }) {
  return (
    <header className="topbar">
      <div className="brand">🎨 Thumb<span>Studio</span></div>
      <div className="topbar-actions">
        <select value={sizeId} onChange={(e) => onSize(e.target.value)} aria-label="Canvas size">
          {SIZE_PRESETS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={onUndo} disabled={!canUndo} title="Undo">↩ Undo</button>
        <button onClick={onRedo} disabled={!canRedo} title="Redo">↪ Redo</button>
        <button onClick={() => onDownload('png')}>⬇ PNG</button>
        <button className="primary" onClick={() => onDownload('jpeg')}>⬇ JPG</button>
      </div>
    </header>
  )
}
