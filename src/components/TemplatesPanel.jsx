import { TEMPLATES } from '../data/templates'

export default function TemplatesPanel({ onApply }) {
  return (
    <section className="panel">
      <h3>Templates</h3>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <button key={t.id} className="template-card" onClick={() => onApply(t)}
            style={{ background: `linear-gradient(${t.background.angle || 135}deg, ${t.background.color1}, ${t.background.color2})` }}>
            <span>{t.name}</span><small>{t.category}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
