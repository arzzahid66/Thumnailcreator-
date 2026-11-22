import { useEffect, useRef } from 'react'
import { renderScene, layerBox } from '../lib/render'

/**
 * The live canvas. Click selects a layer (topmost hit first),
 * drag moves it. Rendering is delegated to lib/render.renderScene,
 * the same code path used for export.
 */
export default function CanvasEditor({ state, imageCache, selectionId, onSelect, onMove, onCommitMove }) {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) renderScene(canvas.getContext('2d'), state, imageCache, { selectionId })
  }, [state, selectionId, imageCache])

  const toSceneCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * state.width,
      y: ((e.clientY - rect.top) / rect.height) * state.height,
    }
  }

  const hitTest = (pt) => {
    const ctx = canvasRef.current.getContext('2d')
    for (let i = state.layers.length - 1; i >= 0; i--) {
      const l = state.layers[i]
      const { w, h } = layerBox(l, ctx)
      if (pt.x >= l.x && pt.x <= l.x + w && pt.y >= l.y && pt.y <= l.y + h) return l
    }
    return null
  }

  const onPointerDown = (e) => {
    const pt = toSceneCoords(e)
    const layer = hitTest(pt)
    onSelect(layer?.id || null)
    if (layer) {
      dragRef.current = { id: layer.id, dx: pt.x - layer.x, dy: pt.y - layer.y, moved: false }
      canvasRef.current.setPointerCapture(e.pointerId)
    }
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const pt = toSceneCoords(e)
    d.moved = true
    onMove(d.id, Math.round(pt.x - d.dx), Math.round(pt.y - d.dy), false)
  }
  const onPointerUp = () => {
    if (dragRef.current?.moved) onCommitMove()
    dragRef.current = null
  }

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} width={state.width} height={state.height}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      <p className="hint">{state.width}×{state.height} — click a layer to select, drag to move. No watermark, ever.</p>
    </div>
  )
}
