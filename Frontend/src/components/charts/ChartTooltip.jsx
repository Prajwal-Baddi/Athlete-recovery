export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-apex border border-apex-border px-3 py-2 text-xs"
      style={{ background: '#131d32' }}
    >
      <div className="text-apex-txt2 font-semibold mb-1.5">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex gap-2 mb-0.5" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span className="font-bold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  )
}
