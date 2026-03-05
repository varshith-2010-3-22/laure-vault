'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import FavoriteButton from './FavoriteButton'

export interface Movie {
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date: string
    overview: string
    genre_ids?: number[]
}

interface MovieCardProps {
    movie: Movie
    priority?: boolean
    index?: number
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export default function MovieCard({
    movie,
    priority = false,
    index = 0,
}: MovieCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

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

    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`
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

                    {/* Favorite button — appears on hover */}
                    <motion.div
                        className="absolute top-3 right-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <FavoriteButton movie={movie} />
                    </motion.div>

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
                        title={movie.title}
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
