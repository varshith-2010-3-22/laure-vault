'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import SearchOverlay from './SearchOverlay'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useI18n, SUPPORTED_LOCALES } from '@/context/I18nContext'
import { useDataSaver } from '@/context/DataSaverContext'

function DataSaverToggle() {
    const { isDataSaver, setDataSaver } = useDataSaver()

    return (
        <button
            onClick={() => setDataSaver(!isDataSaver)}
            className={`p-2 rounded-full transition-all ${
                isDataSaver ? 'bg-orange-100 text-orange-600' : 'text-grey hover:text-ink'
            }`}
            title={isDataSaver ? 'Data Saver On' : 'Data Saver Off'}
            data-cursor-hover
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
        </button>
    )
}

function LanguageSwitcher() {
    const { locale, setLocale } = useI18n()
    const [open, setOpen] = useState(false)

    return (
        <div className="relative group">
            <button
                onClick={() => setOpen(!open)}
                className="text-xs font-sans uppercase tracking-widest text-grey hover:text-ink transition-colors flex items-center gap-1"
                data-cursor-hover
            >
                {locale}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
            {open && (
                <div className="absolute top-full mt-2 right-0 bg-bone border border-border shadow-xl py-2 min-w-[120px] z-[60]">
                    {SUPPORTED_LOCALES.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => {
                                setLocale(l.id as any)
                                setOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-[10px] font-sans uppercase tracking-widest hover:bg-ink hover:text-bone transition-colors ${
                                locale === l.id ? 'text-ink font-bold' : 'text-grey'
                            }`}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Navigation() {
    const { t } = useI18n()

    const NAV_LINKS = [
        { href: '/', label: t('discover') },
        { href: '/vault', label: t('vault') },
        { href: '#', label: t('support'), isUPI: true },
    ]

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
                        {NAV_LINKS.map(({ href, label, isUPI }) => {
                            const isActive = pathname === href && !isUPI
                            return (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        onClick={(e) => {
                                            if (isUPI) {
                                                e.preventDefault();
                                                alert("UPI Support: Redirecting to secure payment intent...");
                                                // window.location.href = "upi://pay?pa=your-vpa@upi&pn=LumiereVault&am=100&cu=INR";
                                            }
                                        }}
                                        className="relative text-sm font-sans tracking-tight transition-opacity duration-200 hover:opacity-70"
                                        style={{
                                            color: isActive
                                                ? 'var(--color-ink)'
                                                : isUPI ? '#ff9933' : 'var(--color-grey)', // Saffron hint
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
                    <div className="flex items-center gap-6">
                        <DataSaverToggle />
                        <LanguageSwitcher />
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
                                {t('search')}
                            </span>
                        </button>
                    </div>

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
