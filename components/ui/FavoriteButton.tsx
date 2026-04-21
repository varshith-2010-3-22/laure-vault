'use client'

import { motion } from 'framer-motion'
import type { Movie } from './MovieCard'
import { useFavorite } from '@/hooks/useFavorite'

interface FavoriteButtonProps {
    movie: Movie
    initialFavorite?: boolean
}

export default function FavoriteButton({ movie, initialFavorite = false }: FavoriteButtonProps) {
    const { isFavorite, isAnimating, toggleFavorite } = useFavorite(movie, initialFavorite)

    return (
        <button
            type="button"
            onClick={toggleFavorite}
            onKeyDown={(e) => e.key === 'Enter' && toggleFavorite(e)}
            aria-label={isFavorite ? `Remove ${movie.title} from Vault` : `Add ${movie.title} to Vault`}
            aria-pressed={isFavorite}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-bone/90 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            data-cursor-hover
        >
            <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isFavorite ? '#1A1A1A' : 'none'}
                stroke="#1A1A1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={isAnimating ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                aria-hidden="true"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
        </button>
    )
}
