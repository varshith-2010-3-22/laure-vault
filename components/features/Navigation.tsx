'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import SearchOverlay from './SearchOverlay'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
    { href: '/', label: 'Discover' },
    { href: '/vault', label: 'Vault' },
]

export default function Navigation() {
    const pathname = usePathname()
    const [searchOpen, setSearchOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Initial session fetch
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    const { scrollY } = useScroll()
    const navOpacity = useTransform(scrollY, [0, 80], [0, 1])
    const navBorderOpacity = useTransform(scrollY, [60, 120], [0, 1])

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 nav-blur"
                style={{ height: 'var(--nav-height)' }}
            >
                {/* Animated bottom border that appears on scroll */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-border"
                    style={{ opacity: navBorderOpacity }}
                    aria-hidden="true"
                />

                <nav
                    className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between"
                    aria-label="Main navigation"
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-display text-xl tracking-tight text-ink hover:opacity-70 transition-opacity duration-300"
                        aria-label="Lumière Vault – go to homepage"
                        data-cursor-hover
                    >
                        Lumière<span className="text-grey ml-1.5">Vault</span>
                    </Link>

                    {/* Center links */}
                    <ul className="hidden md:flex items-center gap-8" role="list">
                        {NAV_LINKS.map(({ href, label }) => {
                            const isActive = pathname === href
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="relative text-sm font-sans tracking-tight transition-opacity duration-200 hover:opacity-70"
                                        style={{
                                            color: isActive
                                                ? 'var(--color-ink)'
                                                : 'var(--color-grey)',
                                        }}
                                        aria-current={isActive ? 'page' : undefined}
                                        data-cursor-hover
                                    >
                                        {label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-underline"
                                                className="absolute -bottom-px left-0 right-0 h-px bg-ink"
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Right: Search trigger */}
                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        aria-label="Open search"
                        className="flex items-center gap-2 text-sm text-grey hover:text-ink transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
                        data-cursor-hover
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <span className="hidden sm:inline font-sans tracking-tight">
                            Search
                        </span>
                        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded border border-border text-[10px] text-grey">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Auth Status / Sign In */}
                    <div className="hidden sm:flex items-center ml-8 pl-8 border-l border-border">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        className="h-6 w-6 rounded-full"
                                    />
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="text-sm text-grey hover:text-ink transition-colors font-sans"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-medium font-sans px-4 py-2 bg-ink text-bone rounded-sm transition-transform hover:scale-105 active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </nav>
            </motion.header>

            {/* Search overlay */}
            <SearchOverlay
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </>
    )
}
