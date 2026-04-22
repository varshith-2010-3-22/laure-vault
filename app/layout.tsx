import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navigation from '@/components/features/Navigation'
import ProgressBar from '@/components/ui/ProgressBar'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    weight: ['300', '400', '500'],
})

const cormorantGaramond = Cormorant_Garamond({
    subsets: ['latin'],
    variable: '--font-cormorant',
    display: 'swap',
    weight: ['300', '400', '500', '600'],
    style: ['normal', 'italic'],
})

export const metadata: Metadata = {
    title: {
        default: 'Lumière Vault — India\'s Favorite Cinematic Collection',
        template: '%s | Lumière Vault',
    },
    description:
        'A high-fidelity, editorial–style movie curation platform for Bollywood, Tollywood, Kollywood, and more.',
    keywords: ['movies', 'cinema', 'film', 'curation', 'vault', 'India', 'Bollywood', 'Tollywood', 'Kollywood', 'OTT release'],
    authors: [{ name: 'Lumière Vault' }],
    manifest: '/manifest.json',
    openGraph: {
        type: 'website',
        siteName: 'Lumière Vault',
        title: 'Lumière Vault — India\'s Favorite Cinematic Collection',
        description:
            'Discover and collect movies from Bollywood, Tollywood, and beyond.',
    },
}

export const viewport = {
    themeColor: '#1A1A1A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`}>
            <head>
                {/* Preconnect to TMDB image CDN */}
                <link rel="preconnect" href="https://image.tmdb.org" />
            </head>
            <body className="bg-bone text-ink antialiased">
                <Providers>
                    {/* Global route-change loading bar */}
                    <ProgressBar />

                    <Navigation />

                    <main className="min-h-screen pt-[var(--nav-height)]">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    )
}
