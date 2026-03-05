'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Movie } from './MovieCard'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface FavoriteButtonProps {
    movie: Movie
}

export default function FavoriteButton({ movie }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    // Determine initial state if we are passing vault metadata
    useEffect(() => {
        // You would typically sync this with a global user vault state or checking the id 
        // Real app implementation will check against cached vault array. 
        // For now, assume false on mount.
    }, [])

    async function handleToggle(e: React.MouseEvent | React.KeyboardEvent) {
        e.preventDefault()
        e.stopPropagation()

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/login')
            return
        }

        setIsAnimating(true)
        const newIsFavorite = !isFavorite
        setIsFavorite(newIsFavorite)

        try {
            const endpoint = `/api/favorites${!newIsFavorite ? `?tmdbId=${movie.id}` : ''}`
            const res = await fetch(endpoint, {
                method: newIsFavorite ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: newIsFavorite ? JSON.stringify(movie) : undefined,
            })

            if (!res.ok) throw new Error('Failed to update favorite')

            // Invalidate the favorites cache so the Vault page re-fetches immediately
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        } catch (error) {
            console.error(error)
            // Revert optimistic update
            setIsFavorite(!newIsFavorite)
        }

        setTimeout(() => setIsAnimating(false), 400)
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            onKeyDown={(e) => e.key === 'Enter' && handleToggle(e)}
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
