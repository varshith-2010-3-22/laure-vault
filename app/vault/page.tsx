'use client'

import { useQuery } from '@tanstack/react-query'
import MovieGrid from '@/components/features/MovieGrid'
import type { Movie } from '@/lib/tmdb'
import { supabase } from '@/lib/supabase'
import { OfflineVault } from '@/lib/offline'

export default function VaultPage() {
    const { data: favorites, isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: async (): Promise<Movie[]> => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return []

            try {
                const res = await fetch('/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                })
                if (!res.ok) throw new Error('API down')
                const json = await res.json()
                return json.favorites ?? []
            } catch (e) {
                // Return cached results if offline or API is down
                console.warn('Vault offline: fetching from local storage')
                return OfflineVault.get()
            }
        },
    })

    const isEmpty = !isLoading && (!favorites || favorites.length === 0)

    return (
        <div className="px-6 md:px-12 py-16">
            {/* Header */}
            <div className="mb-16 pt-8">
                <p className="text-xs font-sans uppercase tracking-wider text-grey mb-4">
                    Your collection
                </p>
                <h1
                    className="font-display text-ink leading-none tracking-tighter"
                    style={{ fontSize: 'clamp(3rem, 8vw, 10rem)' }}
                >
                    The Vault
                </h1>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border mb-12" aria-hidden="true" />

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-32 text-grey text-center">
                    <p className="font-display" style={{ fontSize: 'clamp(1.5rem, 4vw, 4rem)' }}>
                        Your vault is empty.
                    </p>
                    <p className="mt-3 text-sm font-sans max-w-sm">
                        Tap the heart on any movie to add it to your personal collection.
                    </p>
                </div>
            ) : (
                <MovieGrid movies={favorites ?? []} isLoading={isLoading} isVault={true} />
            )}
        </div>
    )
}
