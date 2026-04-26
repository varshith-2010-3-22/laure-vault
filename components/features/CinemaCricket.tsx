'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MovieGrid from './MovieGrid'
import MovieCardSkeleton from '../ui/MovieCardSkeleton'
import { Movie } from '@/lib/tmdb'

export default function CinemaCricket() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCricketMovies() {
            setLoading(true)
            try {
                // Using keywords for cricket (id: 210878) and sports documentaries
                const res = await fetch(`/api/movies/discover?keywords=210878&genres=99`)
                const data = await res.json()
                setMovies(data.results || [])
            } catch (error) {
                console.error('Failed to fetch cricket content', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCricketMovies()
    }, [])

    return (
        <section className="mb-24 relative overflow-hidden bg-ink p-12 rounded-sm">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bone/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
                <div className="mb-12">
                    <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-bone/60 mb-2">
                        The Religion Intersection
                    </p>
                    <h2 className="text-4xl md:text-6xl font-display text-bone tracking-tighter">
                        Cricket <span className="italic text-bone/40">&</span> Cinema
                    </h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <MovieCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
                        {movies.slice(0, 4).map((movie, index) => {
                            // Minor styling override for the specific section
                            return (
                                <motion.div 
                                    key={movie.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-bone/5 p-4 rounded-sm border border-bone/10 hover:border-bone/30 transition-all"
                                >
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} 
                                        alt={movie.title || 'Movie Poster'} 
                                        className="w-full aspect-[2/3] object-cover rounded-sm mb-4"
                                    />
                                    <h3 className="text-bone font-display text-lg leading-tight line-clamp-1">
                                        {movie.title || 'Untitled'}
                                    </h3>
                                    <p className="text-bone/40 text-xs mt-1 uppercase tracking-widest">{movie.release_date?.slice(0,4)}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
                
                <div className="mt-12 flex items-center justify-between">
                    <p className="text-xs text-bone/60 font-sans max-w-sm">
                        Dive into the storytelling behind India's greatest obsession. From IPL documentaries to biographical films of legends.
                    </p>
                    <button className="px-6 py-3 bg-bone text-ink text-[10px] font-sans uppercase tracking-[0.2em] rounded-sm hover:scale-105 active:scale-95 transition-all">
                        Explore Sport Vault
                    </button>
                </div>
            </div>
        </section>
    )
}
