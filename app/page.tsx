import { getPopular, type Movie } from '@/lib/tmdb'
import MovieGrid from '@/components/features/MovieGrid'
import { Suspense } from 'react'
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton'

export const metadata = {
    title: 'Lumière Vault — Discover Cinema',
}

async function getUserRegion() {
    try {
        const res = await fetch('http://ip-api.com/json/', { next: { revalidate: 3600 } })
        if (res.ok) {
            const data = await res.json()
            if (data.status === 'success') {
                return { code: data.countryCode, name: data.country }
            }
        }
    } catch (e) {
        console.error('Failed to fetch IP region', e)
    }
    return { code: 'US', name: 'United States' }
}

async function RegionalGrid() {
    let movies: Movie[] = []
    const region = await getUserRegion()

    try {
        const data = await getPopular(1, region.code)
        movies = data.results
    } catch {
        // Graceful fallback if TMDB key not yet configured
        movies = []
    }

    return (
        <>
            {/* Section divider with dynamic region name */}
            <div className="flex items-center gap-6 mb-12">
                <div className="h-px flex-1 bg-border" aria-hidden="true" />
                <span className="text-xs font-sans uppercase tracking-wider text-grey">
                    Popular in {region.name}
                </span>
                <div className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>

            <MovieGrid movies={movies} />
        </>
    )
}

function GridFallback() {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    )
}

export default function HomePage() {
    return (
        <div className="px-6 md:px-12 py-16">
            {/* Hero section */}
            <section className="mb-20 pt-8">
                <p className="text-xs font-sans uppercase tracking-wider text-grey mb-4">
                    Editorial / Curated
                </p>
                <h1
                    className="font-display text-ink leading-none tracking-tighter mb-8"
                    style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}
                >
                    Discover
                    <br />
                    <em className="text-grey not-italic">Cinema.</em>
                </h1>
                <p className="max-w-md text-sm text-grey font-sans leading-relaxed">
                    A curated vault of films — handpicked, explored, and collected.
                    Your personal cinematic archive.
                </p>
            </section>

            {/* Movie grid with Suspense skeleton */}
            <Suspense fallback={<GridFallback />}>
                <RegionalGrid />
            </Suspense>
        </div>
    )
}
