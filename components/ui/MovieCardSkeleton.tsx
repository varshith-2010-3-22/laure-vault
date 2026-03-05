export default function MovieCardSkeleton() {
    return (
        <div className="relative animate-fade-in">
            {/* Poster skeleton — exact 2:3 aspect ratio */}
            <div
                className="w-full rounded-sm skeleton"
                style={{ aspectRatio: '2 / 3' }}
                aria-hidden="true"
            />

            {/* Title skeleton */}
            <div className="mt-3 px-0.5 space-y-2">
                <div className="h-4 w-3/4 rounded-sm skeleton" aria-hidden="true" />
                <div className="h-3 w-1/4 rounded-sm skeleton" aria-hidden="true" />
            </div>
        </div>
    )
}
