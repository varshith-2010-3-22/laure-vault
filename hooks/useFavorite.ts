'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import type { Movie } from '@/components/ui/MovieCard'
import { OfflineVault } from '@/lib/offline'

export function useFavorite(movie: Movie, initialFavorite: boolean = false) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()

    async function toggleFavorite(e?: React.MouseEvent | React.KeyboardEvent) {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

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

            // Sync with offline vault
            if (newIsFavorite) {
                await OfflineVault.save(movie)
            } else {
                await OfflineVault.remove(movie.id)
            }

            // Invalidate the favorites cache
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
        } catch (error) {
            console.error(error)
            // Revert optimistic update
            setIsFavorite(!newIsFavorite)
        }

        setTimeout(() => setIsAnimating(false), 400)
    }

    return {
        isFavorite,
        isAnimating,
        toggleFavorite,
    }
}
