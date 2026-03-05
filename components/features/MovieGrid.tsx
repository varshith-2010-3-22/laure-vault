'use client'

import MovieCard from '@/components/ui/MovieCard'
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton'
import type { Movie } from '@/lib/tmdb'
import { motion } from 'framer-motion'

interface MovieGridProps {
    movies?: Movie[]
    isLoading?: boolean
    skeletonCount?: number
    className?: string
}

export default function MovieGrid({
    movies = [],
    isLoading = false,
    skeletonCount = 12,
    className = '',
}: MovieGridProps) {
    return (
        <motion.div
            className={`grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 ${className}`}
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.04 } },
                hidden: {},
            }}
        >
            {isLoading
                ? Array.from({ length: skeletonCount }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                ))
                : movies.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} priority={i < 4} />
                ))}
        </motion.div>
    )
}
