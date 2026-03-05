'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'
import MovieCard from '@/components/ui/MovieCard'
import MovieCardSkeleton from '@/components/ui/MovieCardSkeleton'
import type { Movie } from '@/lib/tmdb'

interface SearchOverlayProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setQuery('')
        }
    }, [isOpen])

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    // Also open on ⌘K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                if (!isOpen) onClose() // no-op if already open via parent
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    const { data, isFetching } = useQuery({
        queryKey: ['search', debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery.trim()) return null
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(debouncedQuery)}`
            )
            if (!res.ok) throw new Error('Search failed')
            return res.json() as Promise<{ results: Movie[] }>
        },
        enabled: debouncedQuery.length > 1,
    })

    const results = data?.results ?? []
    const showSkeletons = isFetching && debouncedQuery.length > 1
    const showEmpty =
        !isFetching && debouncedQuery.length > 1 && results.length === 0
    const showResults = !isFetching && results.length > 0

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="search-overlay"
                    className="fixed inset-0 z-[100] bg-bone flex flex-col"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search movies"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 md:px-12 border-b border-border h-[var(--nav-height)]">
                        <span className="font-display text-sm text-grey tracking-wide">
                            Search
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close search"
                            className="text-grey hover:text-ink transition-colors text-sm font-sans tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
                            data-cursor-hover
                        >
                            Esc
                        </button>
                    </div>

                    {/* The search input — a single underlined line per spec */}
                    <div className="px-6 md:px-12 pt-10 pb-6">
                        <div className="relative group">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Title, director, genre…"
                                aria-label="Search for movies"
                                className="w-full bg-transparent font-display text-fluid-title text-ink placeholder:text-border outline-none border-0 border-b border-border pb-3 focus:border-ink transition-colors duration-300"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            {/* Animated underline */}
                            <motion.span
                                className="absolute bottom-0 left-0 h-px bg-ink"
                                initial={{ width: '0%' }}
                                animate={{ width: query ? '100%' : '0%' }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    {/* Results area */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12">
                        {/* Skeletons while searching */}
                        {showSkeletons && (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 mt-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <MovieCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {showEmpty && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-24 text-grey"
                            >
                                <p className="font-display text-fluid-h2 mb-2">No results</p>
                                <p className="font-sans text-sm">
                                    Try a different title or keyword
                                </p>
                            </motion.div>
                        )}

                        {/* Results grid */}
                        {showResults && (
                            <motion.div
                                className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {results.slice(0, 12).map((movie, i) => (
                                    <div key={movie.id} onClick={onClose}>
                                        <MovieCard movie={movie} index={i} />
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Idle state */}
                        {!debouncedQuery && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-display text-fluid-h2 text-border mt-8 select-none"
                            >
                                Begin typing to search
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
