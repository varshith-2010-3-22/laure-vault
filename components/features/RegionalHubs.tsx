'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MovieGrid from './MovieGrid'
import MovieCardSkeleton from '../ui/MovieCardSkeleton'
import { Movie } from '@/lib/tmdb'

const INDUSTRIES = [
    { id: 'all', name: 'All India', region: 'IN' },
    { id: 'hi', name: 'Bollywood (Hindi)', lang: 'hi' },
    { id: 'te', name: 'Tollywood (Telugu)', lang: 'te' },
    { id: 'ta', name: 'Kollywood (Tamil)', lang: 'ta' },
    { id: 'ml', name: 'Mollywood (Malayalam)', lang: 'ml' },
    { id: 'kn', name: 'Sandalwood (Kannada)', lang: 'kn' },
]

export default function RegionalHubs() {
    const [activeTab, setActiveTab] = useState('all')
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMovies() {
            setLoading(true)
            try {
                const industry = INDUSTRIES.find(ind => ind.id === activeTab)
                const params: any = { page: 1 }
                
                if (industry?.lang) params.with_original_language = industry.lang
                if (industry?.region) params.region = industry.region
                else if (activeTab !== 'all') params.region = 'IN'

                // We'll use a server action or a simple fetch to our own API 
                // but for speed in this demo, let's assume we have a simple API route or we could just fetch here if we had the key on client (not recommended but works for MVP)
                // Better: Fetch via a server action or a dedicated API route.
                const res = await fetch(`/api/movies/discover?${new URLSearchParams({
                    ...(industry?.lang ? { lang: industry.lang } : {}),
                    ...(industry?.region ? { region: industry.region } : { region: 'IN' })
                })}`)
                const data = await res.json()
                setMovies(data.results || [])
            } catch (error) {
                console.error('Failed to fetch regional movies', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [activeTab])

    return (
        <section className="mb-20">
            <div className="flex flex-wrap items-center gap-3 mb-10">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-grey mr-4">
                    Explore Industry
                </span>
                {INDUSTRIES.map((industry) => (
                    <button
                        key={industry.id}
                        onClick={() => setActiveTab(industry.id)}
                        className={`relative px-5 py-2.5 rounded-full text-xs font-sans tracking-wide transition-all duration-500 overflow-hidden ${
                            activeTab === industry.id
                                ? 'bg-ink text-bone shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                                : 'bg-transparent text-grey border border-border hover:border-ink hover:text-ink'
                        }`}
                        data-cursor-hover
                    >
                        <span className="relative z-10">{industry.name}</span>
                        {activeTab === industry.id && (
                            <motion.div
                                layoutId="industry-pill"
                                className="absolute inset-0 bg-ink"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <MovieGrid movies={movies} />
                </motion.div>
            )}
        </section>
    )
}
