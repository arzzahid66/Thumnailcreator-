import { useMemo, useRef, useState } from 'react'
import TopBar from './components/TopBar'
import TemplatesPanel from './components/TemplatesPanel'
import Toolbar from './components/Toolbar'
import CanvasEditor from './components/CanvasEditor'
import PropertiesPanel from './components/PropertiesPanel'
import LayersPanel from './components/LayersPanel'
import AdSlot from './components/AdSlot'
import { TEMPLATES, SIZE_PRESETS, textLayer, shapeLayer, badgeLayer, stickerLayer } from './data/templates'
import { downloadImage, fileToDataUrl, loadImageIntoCache } from './lib/render'
import { createHistory, pushHistory, undoHistory, redoHistory, clone } from './lib/history'

const initialScene = () => {
  const t = TEMPLATES[0]
  return { width: 1280, height: 720, background: clone(t.background), layers: t.layers() }
}

export default function App() {
  const [history, setHistory] = useState(() => createHistory(initialScene()))
  const [sizeId, setSizeId] = useState('yt')
  const [selectionId, setSelectionId] = useState(null)
  const [, forceRender] = useState(0)
  const imageCacheRef = useRef({})
  const state = history.present
  const selected = useMemo(() => state.layers.find((l) => l.id === selectionId) || null, [state, selectionId])

  const commit = (next) => setHistory((h) => pushHistory(h, next))
  const patchScene = (patch, commitIt = true) => {
    const next = { ...state, ...patch }
    if (commitIt) commit(next); else setHistory((h) => ({ ...h, present: next }))
  }
  const patchLayer = (id, patch, commitIt = true) =>
    patchScene({ layers: state.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)) }, commitIt)

  const applyTemplate = (t) => {
    // Scale template layers from 1280x720 design space to current canvas.
    const sx = state.width / 1280, sy = state.height / 720
    const layers = t.layers().map((l) => ({
      ...l, x: Math.round(l.x * sx), y: Math.round(l.y * sy),
      fontSize: l.fontSize ? Math.round(l.fontSize * Math.min(sx, sy) || l.fontSize) : l.fontSize,
      width: l.width ? Math.round(l.width * sx) : l.width,
      height: l.height ? Math.round(l.height * sy) : l.height,
    }))
    commit({ ...state, background: clone(t.background), layers })
    setSelectionId(null)
  }

  const changeSize = (id) => {
    const preset = SIZE_PRESETS.find((s) => s.id === id)
    if (!preset) return
    setSizeId(id)
    const sx = preset.width / state.width, sy = preset.height / state.height
    const layers = state.layers.map((l) => ({
      ...l, x: Math.round(l.x * sx), y: Math.round(l.y * sy),
      width: l.width ? Math.round(l.width * sx) : l.width,
      height: l.height ? Math.round(l.height * sy) : l.height,
      fontSize: l.fontSize ? Math.max(12, Math.round(l.fontSize * Math.min(sx, sy))) : l.fontSize,
    }))
    commit({ ...state, width: preset.width, height: preset.height, layers })
  }

  const addLayer = (layer) => { commit({ ...state, layers: [...state.layers, layer] }); setSelectionId(layer.id) }

  const uploadImage = async (file, asLayer = true) => {
    const src = await fileToDataUrl(file)
    loadImageIntoCache(src, imageCacheRef.current, () => forceRender((n) => n + 1))
    if (asLayer) addLayer({ id: `img-${Date.now()}`, type: 'image', src, x: 80, y: 80, width: 480, height: 360, rotation: 0, opacity: 1 })
  }

  return (
    <div className="app">
      <TopBar sizeId={sizeId} onSize={changeSize}
        onUndo={() => setHistory(undoHistory)} onRedo={() => setHistory(redoHistory)}
        canUndo={history.past.length > 0} canRedo={history.future.length > 0}
        onDownload={(fmt) => downloadImage(state, imageCacheRef.current, fmt)} />
      <AdSlot slot="header" />
      <main className="layout">
        <aside className="left">
          <TemplatesPanel onApply={applyTemplate} />
          <Toolbar
            onAddText={() => addLayer(textLayer('YOUR TEXT', 80, 120, { fontSize: 90 }))}
            onAddShape={(s) => addLayer(shapeLayer(s, 120, 140, 260, 160))}
            onAddBadge={() => addLayer(badgeLayer('NEW', 90, 90))}
            onAddSticker={(e) => addLayer(stickerLayer(e, 200, 200))}
            onUploadImage={(f) => uploadImage(f)}
            background={state.background}
            onBackground={(bg) => patchScene({ background: bg })} />
        </aside>
        <CanvasEditor state={state} imageCache={imageCacheRef.current} selectionId={selectionId}
          onSelect={setSelectionId}
          onMove={(id, x, y) => patchLayer(id, { x, y }, false)}
          onCommitMove={() => commit(state)} />
        <aside className="right">
          <PropertiesPanel layer={selected}
            onChange={(id, patch) => patchLayer(id, patch)}
            onDelete={(id) => { commit({ ...state, layers: state.layers.filter((l) => l.id !== id) }); setSelectionId(null) }}
            onDuplicate={(id) => {
              const l = state.layers.find((x) => x.id === id)
              if (l) addLayer({ ...clone(l), id: `layer-${Date.now()}`, x: l.x + 24, y: l.y + 24 })
            }} />
          <LayersPanel layers={state.layers} selectionId={selectionId} onSelect={setSelectionId}
            onReorder={(id, dir) => {
              const i = state.layers.findIndex((l) => l.id === id); const j = i + dir
              if (j < 0 || j >= state.layers.length) return
              const layers = [...state.layers]; [layers[i], layers[j]] = [layers[j], layers[i]]
              commit({ ...state, layers })
            }}
            onSetBackgroundImage={(l) => patchScene({ background: { type: 'image', src: l.src, color1: '#000', color2: '#000', angle: 0 } })} />
          <AdSlot slot="sidebar" />
        </aside>
      </main>
      <footer className="footer">
        Thumb Studio — 100% free, no watermark, no sign-up. Designs never leave your browser.
        <AdSlot slot="footer" />
      </footer>
    </div>
  )
}
