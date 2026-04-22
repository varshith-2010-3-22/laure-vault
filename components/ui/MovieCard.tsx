'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import FavoriteButton from './FavoriteButton'
import { useFavorite } from '@/hooks/useFavorite'
import { useDataSaver } from '@/context/DataSaverContext'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export interface Movie {
    id: number
    title: string | null
    poster_path: string | null
    vote_average: number | null
    release_date: string | null
    overview: string | null
    genre_ids?: number[]
}

interface MovieCardProps {
    movie: Movie | (Partial<Movie> & { id: number })
    priority?: boolean
    index?: number
    isVault?: boolean
}


export default function MovieCard({
    movie: movieProp,
    priority = false,
    index = 0,
    isVault = false,
}: MovieCardProps) {
    const movie: Movie = {
        id: movieProp.id,
        title: movieProp.title ?? 'Untitled',
        poster_path: movieProp.poster_path ?? null,
        vote_average: movieProp.vote_average ?? 0,
        release_date: movieProp.release_date ?? '',
        overview: movieProp.overview ?? '',
        genre_ids: movieProp.genre_ids,
    } as Movie
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const { toggleFavorite } = useFavorite(movie, isVault)
    const { isDataSaver } = useDataSaver()

    const cardRef = useRef<HTMLDivElement>(null)

    // Parallax tilt values
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
        stiffness: 100,
        damping: 20,
    })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
        stiffness: 100,
        damping: 20,
    })

    // Inner image parallax (subtle)
    const imgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
        stiffness: 100,
        damping: 20,
    })
    const imgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), {
        stiffness: 100,
        damping: 20,
    })

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    function handleMouseLeave() {
        mouseX.set(0)
        mouseY.set(0)
        setIsHovered(false)
    }

    const posterResolution = isDataSaver ? 'w185' : 'w500'
    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE}/${posterResolution}${movie.poster_path}`
        : null

    const year = movie.release_date?.slice(0, 4) ?? ''
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.04,
            }}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspectiveOrigin: 'center center',
            }}
            className="relative group"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            data-cursor-hover
        >
            <Link
                href={`/movie/${movie.id}`}
                aria-label={`View details for ${movie.title}`}
                tabIndex={0}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bone rounded-sm"
            >
                {/* Poster container */}
                <motion.div
                    className="relative w-full overflow-hidden rounded-sm bg-[#EBEBEB]"
                    style={{ aspectRatio: '2 / 3' }}
                    animate={{
                        boxShadow: isHovered
                            ? '0 12px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)'
                            : '0 2px 16px rgba(0,0,0,0.03)',
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Skeleton shown while image loads */}
                    {!imageLoaded && (
                        <div
                            className="absolute inset-0 skeleton"
                            aria-hidden="true"
                        />
                    )}

                    {posterUrl ? (
                        <motion.div
                            className="absolute inset-0"
                            style={{ x: imgX, y: imgY }}
                        >
                            <Image
                                src={posterUrl}
                                alt={`${movie.title} movie poster`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={`object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                                priority={priority}
                                draggable={false}
                            />
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex items-end p-4 bg-[#1A1A1A]">
                            <span className="text-bone/40 font-display text-lg leading-tight">
                                No Image
                            </span>
                        </div>
                    )}

                    {/* Hover overlay gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        aria-hidden="true"
                    />

                    {/* Favorite/Remove button — appears on hover */}
                    <motion.div
                        className="absolute top-3 right-3 flex gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <FavoriteButton movie={movie} initialFavorite={isVault} />
                    </motion.div>

                    {isVault && (
                        <motion.button
                            onClick={toggleFavorite}
                            className="absolute top-3 left-3 px-2 py-1 bg-ink/80 backdrop-blur-sm text-bone text-[10px] font-sans uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ x: -10 }}
                            animate={{ x: isHovered ? 0 : -10 }}
                        >
                            Remove
                        </motion.button>
                    )}

                    {/* Quick WhatsApp Share Button */}
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const text = `Check out "${movie.title}" on Lumière Vault! 🍿\n${window.location.origin}/movie/${movie.id}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="absolute bottom-3 right-3 p-2.5 bg-[#25D366] rounded-full text-white shadow-xl touch-none md:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-90"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: isHovered ? 1 : 0.8 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Share on WhatsApp"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </motion.button>

                    {/* Rating badge */}
                    <motion.div
                        className="absolute bottom-3 left-3"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                    >
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-bone/90 backdrop-blur-sm text-ink text-xs font-sans tracking-tight">
                            <svg
                                width="9"
                                height="9"
                                viewBox="0 0 12 12"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M6 0l1.5 4H12L8.5 6.5 10 11 6 8.5 2 11l1.5-4.5L0 4h4.5z" />
                            </svg>
                            {rating}
                        </span>
                    </motion.div>
                </motion.div>

                {/* Card metadata */}
                <div className="mt-3 px-0.5">
                    <h3
                        className="font-display text-lg leading-tight tracking-tight text-ink line-clamp-1"
                        title={movie.title ?? 'Untitled'}
                    >
                        {movie.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-grey font-sans tracking-wide uppercase">
                        {year}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
