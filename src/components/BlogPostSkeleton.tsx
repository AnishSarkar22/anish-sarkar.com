export default function BlogPostSkeleton() {
  return (
    <div className="mx-auto mt-5 max-w-4xl p-8 px-6 font-mono text-md">
      <div className="mb-8 h-8 w-24 animate-pulse rounded-md bg-zinc-800" />
      
      <div className="mb-4 h-12 w-3/4 animate-pulse rounded-md bg-zinc-800" />
      <div className="mb-12 h-6 w-1/4 animate-pulse rounded-md bg-zinc-800" />
      
      <div className="space-y-6">
        <div className="h-4 w-full animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-full animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-3/6 animate-pulse rounded-md bg-zinc-800" />
      </div>
      
      {/* Skeleton for dotted lists */}
      <div className="my-8 space-y-4">
        <div className="flex items-start">
          <div className="mt-1 mr-3 h-3 w-3 flex-shrink-0 rounded-full bg-green-500/40" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="flex items-start">
          <div className="mt-1 mr-3 h-3 w-3 flex-shrink-0 rounded-full bg-green-500/40" />
          <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="flex items-start">
          <div className="mt-1 mr-3 h-3 w-3 flex-shrink-0 rounded-full bg-green-500/40" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="flex items-start">
          <div className="mt-1 mr-3 h-3 w-3 flex-shrink-0 rounded-full bg-green-500/40" />
          <div className="h-4 w-3/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
      </div>
      
      <div className="my-8 h-64 w-full animate-pulse rounded-lg bg-zinc-800" />
      
      {/* Skeleton for numbered lists */}
      <div className="my-8 space-y-4">
        <div className="flex items-start">
          <div className="w-6 flex-shrink-0 font-mono text-green-500/60">1.</div>
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="flex items-start">
          <div className="w-6 flex-shrink-0 font-mono text-green-500/60">2.</div>
          <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="flex items-start">
          <div className="w-6 flex-shrink-0 font-mono text-green-500/60">3.</div>
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="h-4 w-full animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-800" />
        <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-800" />
      </div>
    </div>
  );
}