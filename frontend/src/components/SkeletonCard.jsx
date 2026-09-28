/* Skeleton card matching PostCard layout */
const SkeletonCard = () => (
  <div className="brutal-card overflow-hidden">
    <div className="bg-neutral/50 animate-pulse h-48 w-full border-b-2 border-black" />
    <div className="p-5 space-y-4">
      <div className="bg-neutral animate-pulse h-6 w-24 border-2 border-black/10" />
      <div className="bg-neutral animate-pulse h-6 w-3/4" />
      <div className="bg-neutral animate-pulse h-4 w-full" />
      <div className="bg-neutral animate-pulse h-4 w-5/6" />
      <div className="pt-3 border-t-2 border-dashed border-black/10 space-y-3 mt-4">
        <div className="bg-neutral animate-pulse h-4 w-40" />
        <div className="bg-neutral animate-pulse h-4 w-28" />
      </div>
      <div className="bg-neutral animate-pulse h-12 w-full mt-4 brutal-border" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonGrid };
export default SkeletonCard;
