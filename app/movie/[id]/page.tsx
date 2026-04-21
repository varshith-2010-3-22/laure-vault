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
        const movieId = Number(params.id)
        if (isNaN(movieId)) return { title: 'Movie Not Found' }
        
        const movie = await getMovieDetails(movieId)
        return {
            title: `${movie.title} — Lumière Vault`,
            description: movie.overview,
        }
    } catch {
        return { title: 'Movie' }
    }
}

export default async function MoviePage(props: PageProps) {
    const params = await props.params;
    const movieId = Number(params.id);
    
    if (isNaN(movieId)) {
        notFound();
    }

    let movie;
    try {
        movie = await getMovieDetails(movieId);
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
        notFound();
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
                        <div className="flex items-center gap-6">
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

                            <button
                                onClick={() => {
                                    const text = `Check out "${movie.title}" on Lumière Vault! 🍿\n${window.location.href}`;
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-sm text-xs font-sans font-medium hover:scale-105 active:scale-95 transition-all shadow-md"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Share on WhatsApp
                            </button>
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
