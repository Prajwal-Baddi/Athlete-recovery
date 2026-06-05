export default function Toggle({ on = false, onChange, color = '#00d4aa' }) {
  return (
    <div
      onClick={() => onChange?.(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? color : 'rgba(255,255,255,0.08)',
        border: `1px solid ${on ? color + '60' : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
      role="checkbox"
      aria-checked={on}
    >
      <div
        style={{
          position: 'absolute', top: 3,
          left: on ? 21 : 3,
          width: 14, height: 14, borderRadius: '50%',
          background: on ? '#000' : '#4a5568',
          transition: 'left 0.2s, background 0.2s',
        }}
      />
    </div>
  )
}
