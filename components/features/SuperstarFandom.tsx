'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MovieGrid from './MovieGrid'
import MovieCardSkeleton from '../ui/MovieCardSkeleton'
import { Movie } from '@/lib/tmdb'
import Image from 'next/image'

const SUPERSTARS = [
    { id: '3223', name: 'Shah Rukh Khan', tag: 'SRK Universe', image: 'https://image.tmdb.org/t/p/w185/86jeYvtp6UoauuLYm6i8XmBIsfI.jpg' },
    { id: '111667', name: 'Thalapathy Vijay', tag: 'Vijay Vault', image: 'https://image.tmdb.org/t/p/w185/6vAnRTMsP9jEpsCoyE9U8OAnD8.jpg' },
    { id: '83141', name: 'Allu Arjun', tag: 'AA Hits', image: 'https://image.tmdb.org/t/p/w185/19S116PCDiC5XhMvIuDqIu2Ff0U.jpg' },
    { id: '121332', name: 'Prabhas', tag: 'Rebel Star', image: 'https://image.tmdb.org/t/p/w185/pY5o53n79a785D4I7oU73y9xY8w.jpg' },
]

export default function SuperstarFandom() {
    const [selectedActor, setSelectedActor] = useState(SUPERSTARS[0])
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchActorMovies() {
            setLoading(true)
            try {
                const res = await fetch(`/api/movies/discover?cast=${selectedActor.id}`)
                const data = await res.json()
                setMovies(data.results || [])
            } catch (error) {
                console.error('Failed to fetch actor movies', error)
            } finally {
                setLoading(false)
            }
        }
        fetchActorMovies()
    }, [selectedActor])

    return (
        <section className="mb-24 px-6 md:px-0">
            <div className="flex items-center gap-6 mb-12">
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-grey">
                    Superstar Fandoms
                </span>
                <div className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-8 mb-12">
                {SUPERSTARS.map((star) => (
                    <button
                        key={star.id}
                        onClick={() => setSelectedActor(star)}
                        className={`flex items-center gap-4 group transition-all ${
                            selectedActor.id === star.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                        }`}
                        data-cursor-hover
                    >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border group-hover:border-ink transition-colors">
                            <Image src={star.image} alt={star.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-sans uppercase tracking-widest text-grey transition-colors group-hover:text-ink">
                                {star.tag}
                            </p>
                            <h3 className="text-sm font-display text-ink uppercase tracking-tight">
                                {star.name}
                            </h3>
                        </div>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    key={selectedActor.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <MovieGrid movies={movies.slice(0, 4)} />
                    <button className="mt-8 text-[10px] font-sans uppercase tracking-widest text-grey hover:text-ink border-b border-transparent hover:border-ink transition-all pb-1">
                        View Entire {selectedActor.name} Vault →
                    </button>
                </motion.div>
            )}
        </section>
    )
}
