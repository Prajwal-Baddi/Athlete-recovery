export default function Tag({ children, color = '#00d4aa' }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider inline-block border"
      style={{
        color,
        background:   `${color}20`,
        borderColor:  `${color}30`,
      }}
    >
      {children}
    </span>
  )
}
