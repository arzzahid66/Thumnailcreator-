import { FONTS } from '../data/templates'

export default function PropertiesPanel({ layer, onChange, onDelete, onDuplicate }) {
  if (!layer) {
    return <section className="panel"><h3>Properties</h3><p className="muted">Select a layer on the canvas or in Layers to edit it.</p></section>
  }
  const set = (patch) => onChange(layer.id, patch)
  const hasText = ['text', 'badge', 'sticker'].includes(layer.type)
  const hasSize = ['shape', 'image'].includes(layer.type)

  return (
    <section className="panel">
      <h3>Properties — {layer.type}</h3>
      {hasText && (
        <label className="field">Text
          <input type="text" value={layer.text || ''} onChange={(e) => set({ text: e.target.value })} />
        </label>
      )}
      {hasText && layer.type !== 'sticker' && (
        <label className="field">Font
          <select value={layer.fontFamily} onChange={(e) => set({ fontFamily: e.target.value })}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </label>
      )}
      {hasText && (
        <label className="field">Font size {layer.fontSize}
          <input type="range" min="16" max="220" value={layer.fontSize} onChange={(e) => set({ fontSize: Number(e.target.value) })} />
        </label>
      )}
      {(layer.type === 'text' || layer.type === 'shape') && (
        <label className="field">Color <input type="color" value={layer.color || '#ffffff'} onChange={(e) => set({ color: e.target.value })} /></label>
      )}
      {layer.type === 'badge' && (
        <label className="field">Badge color <input type="color" value={layer.bg || '#e11d48'} onChange={(e) => set({ bg: e.target.value })} /></label>
      )}
      {layer.type === 'text' && (
        <>
          <label className="field">Outline width {layer.strokeWidth}
            <input type="range" min="0" max="20" value={layer.strokeWidth || 0} onChange={(e) => set({ strokeWidth: Number(e.target.value) })} />
          </label>
          <label className="field">Outline color <input type="color" value={layer.strokeColor || '#000000'} onChange={(e) => set({ strokeColor: e.target.value })} /></label>
          <label className="field inline"><input type="checkbox" checked={!!layer.shadow} onChange={(e) => set({ shadow: e.target.checked })} /> Shadow</label>
        </>
      )}
      {hasSize && (
        <>
          <label className="field">Width {Math.round(layer.width)}
            <input type="range" min="20" max="1600" value={layer.width} onChange={(e) => set({ width: Number(e.target.value) })} />
          </label>
          <label className="field">Height {Math.round(layer.height)}
            <input type="range" min="10" max="1200" value={layer.height} onChange={(e) => set({ height: Number(e.target.value) })} />
          </label>
        </>
      )}
      <label className="field">X / Y
        <span className="xy">
          <input type="number" value={Math.round(layer.x)} onChange={(e) => set({ x: Number(e.target.value) })} />
          <input type="number" value={Math.round(layer.y)} onChange={(e) => set({ y: Number(e.target.value) })} />
        </span>
      </label>
      <label className="field">Rotation {layer.rotation || 0}°
        <input type="range" min="-180" max="180" value={layer.rotation || 0} onChange={(e) => set({ rotation: Number(e.target.value) })} />
      </label>
      <label className="field">Opacity {Math.round((layer.opacity ?? 1) * 100)}%
        <input type="range" min="10" max="100" value={Math.round((layer.opacity ?? 1) * 100)} onChange={(e) => set({ opacity: Number(e.target.value) / 100 })} />
      </label>
      <div className="btn-row">
        <button onClick={() => onDuplicate(layer.id)}>⧉ Duplicate</button>
        <button className="danger" onClick={() => onDelete(layer.id)}>🗑 Delete</button>
      </div>
    </section>
  )
}
