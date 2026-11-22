export default function LayersPanel({ layers, selectionId, onSelect, onReorder, onSetBackgroundImage }) {
  const label = (l) => l.type === 'image' ? '🖼 Image' : l.type === 'shape' ? `⬛ ${l.shape}` : `${l.type === 'sticker' ? '✨' : 'T'} ${l.text || ''}`.slice(0, 28)
  const reversed = [...layers].reverse() // topmost first, like design tools
  return (
    <section className="panel">
      <h3>Layers</h3>
      {reversed.length === 0 && <p className="muted">No layers yet — pick a template.</p>}
      <ul className="layers">
        {reversed.map((l) => {
          const idx = layers.findIndex((x) => x.id === l.id)
          return (
            <li key={l.id} className={l.id === selectionId ? 'active' : ''} onClick={() => onSelect(l.id)}>
              <span>{label(l)}</span>
              <span className="layer-btns" onClick={(e) => e.stopPropagation()}>
                <button disabled={idx === layers.length - 1} onClick={() => onReorder(l.id, 1)} title="Bring forward">↑</button>
                <button disabled={idx === 0} onClick={() => onReorder(l.id, -1)} title="Send backward">↓</button>
                {l.type === 'image' && <button onClick={() => onSetBackgroundImage(l)} title="Use as background">BG</button>}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
