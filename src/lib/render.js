// Pure canvas rendering + export. Used by the live editor AND download,
// so what you see is exactly what you export.

export function drawBackground(ctx, bg, w, h, imageCache) {
  if (bg.type === 'image' && bg.src && imageCache[bg.src]) {
    const img = imageCache[bg.src]
    const scale = Math.max(w / img.width, h / img.height)
    const dw = img.width * scale, dh = img.height * scale
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    return
  }
  if (bg.type === 'gradient') {
    const rad = ((bg.angle ?? 135) * Math.PI) / 180
    const x1 = w / 2 - Math.cos(rad) * w / 2, y1 = h / 2 - Math.sin(rad) * h / 2
    const x2 = w / 2 + Math.cos(rad) * w / 2, y2 = h / 2 + Math.sin(rad) * h / 2
    const g = ctx.createLinearGradient(x1, y1, x2, y2)
    g.addColorStop(0, bg.color1); g.addColorStop(1, bg.color2)
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = bg.color1
  }
  ctx.fillRect(0, 0, w, h)
}

function withTransform(ctx, layer, draw) {
  ctx.save()
  ctx.globalAlpha = layer.opacity ?? 1
  ctx.translate(layer.x, layer.y)
  if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180)
  draw()
  ctx.restore()
}

/** Approximate bounding box (in layer-local coords) for hit-testing / selection. */
export function layerBox(layer, ctx) {
  if (layer.type === 'text' || layer.type === 'sticker') {
    ctx.save()
    ctx.font = fontOf(layer)
    const w = Math.max(40, ctx.measureText(layer.text || '').width)
    ctx.restore()
    return { w, h: layer.fontSize * 1.15 }
  }
  if (layer.type === 'badge') {
    ctx.save(); ctx.font = fontOf(layer)
    const w = ctx.measureText(layer.text || '').width + layer.fontSize * 1.2
    ctx.restore()
    return { w, h: layer.fontSize * 1.7 }
  }
  if (layer.type === 'image') return { w: layer.width || 400, h: layer.height || 300 }
  return { w: layer.width || 200, h: layer.height || 120 } // shape
}

export function fontOf(layer) {
  return `${layer.fontSize}px "${layer.fontFamily || 'Anton'}", sans-serif`
}

export function drawLayer(ctx, layer, imageCache) {
  withTransform(ctx, layer, () => {
    if (layer.type === 'text' || layer.type === 'sticker') {
      ctx.font = fontOf(layer)
      ctx.textBaseline = 'top'; ctx.textAlign = layer.align || 'left'
      if (layer.shadow) { ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5 }
      if (layer.strokeWidth > 0) {
        ctx.lineWidth = layer.strokeWidth; ctx.strokeStyle = layer.strokeColor || '#000'; ctx.lineJoin = 'round'
        ctx.strokeText(layer.text || '', 0, 0)
      }
      ctx.fillStyle = layer.color || '#fff'
      ctx.fillText(layer.text || '', 0, 0)
    } else if (layer.type === 'badge') {
      ctx.font = `700 ${layer.fontSize}px "${layer.fontFamily || 'Montserrat'}", sans-serif`
      const w = ctx.measureText(layer.text || '').width + layer.fontSize * 1.2
      const h = layer.fontSize * 1.7
      ctx.fillStyle = layer.bg || '#e11d48'
      ctx.beginPath(); ctx.roundRect(0, 0, w, h, h / 3); ctx.fill()
      ctx.fillStyle = layer.color || '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center'
      ctx.fillText(layer.text || '', w / 2, h / 2 + 2)
    } else if (layer.type === 'shape') {
      ctx.fillStyle = layer.color || '#ff3355'
      if (layer.shape === 'circle') {
        ctx.beginPath(); ctx.ellipse(layer.width / 2, layer.height / 2, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2); ctx.fill()
      } else if (layer.shape === 'triangle') {
        ctx.beginPath(); ctx.moveTo(layer.width / 2, 0); ctx.lineTo(layer.width, layer.height); ctx.lineTo(0, layer.height); ctx.closePath(); ctx.fill()
      } else {
        ctx.fillRect(0, 0, layer.width, layer.height)
      }
    } else if (layer.type === 'image') {
      const img = imageCache[layer.src]
      if (img) ctx.drawImage(img, 0, 0, layer.width, layer.height)
      else { ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, layer.width, layer.height) }
    }
  })
}

export function renderScene(ctx, state, imageCache, { selectionId = null } = {}) {
  const { width, height, background, layers } = state
  ctx.clearRect(0, 0, width, height)
  drawBackground(ctx, background, width, height, imageCache)
  for (const layer of layers) drawLayer(ctx, layer, imageCache)
  if (selectionId) {
    const layer = layers.find((l) => l.id === selectionId)
    if (layer) {
      const { w, h } = layerBox(layer, ctx)
      ctx.save()
      ctx.translate(layer.x, layer.y)
      if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180)
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = Math.max(2, width / 400); ctx.setLineDash([10, 7])
      ctx.strokeRect(-6, -6, w + 12, h + 12)
      ctx.restore()
    }
  }
}

/** Render offscreen at full resolution and trigger a PNG/JPG download. */
export function downloadImage(state, imageCache, format = 'png') {
  const canvas = document.createElement('canvas')
  canvas.width = state.width; canvas.height = state.height
  renderScene(canvas.getContext('2d'), state, imageCache)
  const a = document.createElement('a')
  a.download = `thumb-studio.${format === 'jpeg' ? 'jpg' : 'png'}`
  a.href = canvas.toDataURL(`image/${format}`, 0.92)
  a.click()
}

export function loadImageIntoCache(src, imageCache, onLoad) {
  if (imageCache[src]) { onLoad?.(); return }
  const img = new Image()
  img.onload = () => { imageCache[src] = img; onLoad?.() }
  img.src = src
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}
