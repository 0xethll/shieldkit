export default function QueueItemSkeleton() {
  return (
    <div className="p-3 bg-secondary/50 border border-border rounded-dynamic-xl animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Amount skeleton */}
          <div className="h-4 bg-muted rounded-dynamic w-16" />
          {/* Time skeleton */}
          <div className="h-3 bg-muted rounded-dynamic w-12" />
        </div>
        {/* Button skeleton */}
        <div className="h-7 w-16 bg-muted rounded-dynamic shrink-0" />
      </div>
    </div>
  )
}
