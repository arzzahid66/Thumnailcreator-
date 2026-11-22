import { useRef } from 'react'
import { STICKERS } from '../data/templates'

export default function Toolbar({ onAddText, onAddShape, onAddBadge, onAddSticker, onUploadImage, background, onBackground }) {
  const fileRef = useRef(null)
  return (
    <section className="panel">
      <h3>Add Elements</h3>
      <div className="btn-row">
        <button onClick={onAddText}>＋ Text</button>
        <button onClick={() => onAddShape('rect')}>▭ Rect</button>
        <button onClick={() => onAddShape('circle')}>● Circle</button>
        <button onClick={() => onAddShape('triangle')}>▲ Triangle</button>
        <button onClick={onAddBadge}>🏷 Badge</button>
        <button onClick={() => fileRef.current?.click()}>🖼 Upload Photo</button>
        <input ref={fileRef} type="file" accept="image/*" hidden
          onChange={(e) => { if (e.target.files[0]) onUploadImage(e.target.files[0]); e.target.value = '' }} />
      </div>
      <div className="sticker-row">
        {STICKERS.map((s) => <button key={s} onClick={() => onAddSticker(s)}>{s}</button>)}
      </div>

      <h3>Background</h3>
      <label className="field">Type
        <select value={background.type} onChange={(e) => onBackground({ ...background, type: e.target.value })}>
          <option value="gradient">Gradient</option>
          <option value="solid">Solid</option>
          <option value="image">Uploaded image (use Upload, then “Set as BG” in Layers)</option>
        </select>
      </label>
      <label className="field">Color 1 <input type="color" value={background.color1} onChange={(e) => onBackground({ ...background, color1: e.target.value })} /></label>
      {background.type === 'gradient' && (
        <>
          <label className="field">Color 2 <input type="color" value={background.color2} onChange={(e) => onBackground({ ...background, color2: e.target.value })} /></label>
          <label className="field">Angle {background.angle}°
            <input type="range" min="0" max="360" value={background.angle}
              onChange={(e) => onBackground({ ...background, angle: Number(e.target.value) })} />
          </label>
        </>
      )}
    </section>
  )
}
