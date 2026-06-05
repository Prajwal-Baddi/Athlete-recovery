import { cn } from '@/utils/helpers'

export default function ProgressBar({ value, color = '#00d4aa', height = 5, className = '' }) {
  return (
    <div
      className={cn('rounded-full overflow-hidden', className)}
      style={{ height, background: 'rgba(255,255,255,0.06)' }}
    >
      <div
        style={{
          width:      `${Math.max(0, Math.min(100, value))}%`,
          height:     '100%',
          background:  color,
          borderRadius: 99,
          transition:  'width 1s ease',
          boxShadow:   `0 0 5px ${color}50`,
        }}
      />
    </div>
  )
}
