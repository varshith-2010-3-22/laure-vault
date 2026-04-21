import { getMovieDetails, IMAGE_SIZES } from '@/lib/tmdb'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import FavoriteButton from '@/components/ui/FavoriteButton'
import RegionalTranslator from '@/components/features/RegionalTranslator'

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    try {
        const params = await props.params
        const movie = await getMovieDetails(Number(params.id))
        return {
            title: movie.title,
            description: movie.overview,
        }
    } catch {
        return { title: 'Movie' }
    }
}

export default async function MoviePage(props: PageProps) {
    let movie
    try {
        const params = await props.params
        movie = await getMovieDetails(Number(params.id))
    } catch {
        notFound()
    }

    const backdropUrl = movie.backdrop_path
        ? `${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
        : null

    const posterUrl = movie.poster_path
        ? `${IMAGE_SIZES.poster.large}${movie.poster_path}`
        : null

    const year = movie.release_date?.slice(0, 4) ?? ''
    const runtime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : null

    return (
        <div className="min-h-screen">
            {/* Full-bleed backdrop */}
            {backdropUrl && (
                <div className="relative w-full h-[60vh] overflow-hidden -mt-[var(--nav-height)]">
                    <Image
                        src={backdropUrl}
                        alt={`${movie.title} backdrop`}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                    {/* Gradient fade to bone */}
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-bone/30 to-bone"
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 pb-24">
                <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                    {/* Poster */}
                    {posterUrl && (
                        <div className="flex-shrink-0">
                            <div
                                className="relative w-48 md:w-64 rounded-sm overflow-hidden shadow-card-hover -mt-20 md:-mt-32"
                                style={{ aspectRatio: '2/3' }}
                            >
                                <Image
                                    src={posterUrl}
                                    alt={`${movie.title} poster`}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 192px, 256px"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="flex-1 pt-4">
                        {/* Genre tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {movie.genres?.map((g) => (
                                <span
                                    key={g.id}
                                    className="text-[10px] font-sans uppercase tracking-wider text-grey px-2 py-0.5 border border-border rounded-sm"
                                >
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1
                            className="font-display text-ink leading-none tracking-tighter mb-2"
                            style={{ fontSize: 'clamp(2rem, 5vw, 6rem)' }}
                        >
                            {movie.title}
                        </h1>

                        {/* Tagline */}
                        {movie.tagline && (
                            <p className="font-display italic text-grey text-lg mb-6">
                                {movie.tagline}
                            </p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-grey font-sans">
                            {year && <span>{year}</span>}
                            {runtime && (
                                <>
                                    <span className="text-border">·</span>
                                    <span>{runtime}</span>
                                </>
                            )}
                            {movie.vote_average > 0 && (
                                <>
                                    <span className="text-border">·</span>
                                    <span>★ {movie.vote_average.toFixed(1)}</span>
                                </>
                            )}
                        </div>

                        {/* Overview */}
                        <div className="mb-8">
                            <p className="text-sm text-ink/70 font-sans leading-relaxed max-w-prose">
                                {movie.overview}
                            </p>
                            <RegionalTranslator originalText={movie.overview} />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <FavoriteButton movie={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                vote_average: movie.vote_average,
                                release_date: movie.release_date,
                                overview: movie.overview,
                            }} />
                            <span className="text-sm text-grey font-sans">Add to Vault</span>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                    <div className="mt-24">
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-xs font-sans uppercase tracking-wider text-grey">
                                Cast
                            </span>
                            <div className="h-px flex-1 bg-border" aria-hidden="true" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                            {movie.credits.cast.slice(0, 10).map((person) => (
                                <div key={person.id} className="group">
                                    <div
                                        className="relative w-full overflow-hidden bg-white rounded-sm mb-3 shadow-sm border border-border"
                                        style={{ aspectRatio: '2/3' }}
                                    >
                                        {person.profile_path ? (
                                            <Image
                                                src={`${IMAGE_SIZES.profile.medium}${person.profile_path}`}
                                                alt={person.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#EBEBEB]">
                                                <span className="text-[10px] text-grey uppercase tracking-widest text-center px-4 opacity-50">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-sans text-sm text-ink font-medium leading-tight mb-1">
                                        {person.name}
                                    </h3>
                                    <p className="font-sans text-xs text-grey leading-tight line-clamp-2">
                                        {person.character}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
