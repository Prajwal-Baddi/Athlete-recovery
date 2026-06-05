import { cn } from '@/utils/helpers'

export default function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={cn('skeleton', className)}
      style={style}
    />
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  )
}
