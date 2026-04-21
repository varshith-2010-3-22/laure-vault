import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    themeColor: '#1A1A1A',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    openGraph: {
        type: 'website',
        siteName: 'Lumière Vault',
        title: 'Lumière Vault — India\'s Favorite Cinematic Collection',
        description:
            'Discover and collect movies from Bollywood, Tollywood, and beyond.',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                {/* Preconnect to TMDB image CDN */}
                <link rel="preconnect" href="https://image.tmdb.org" />
                {/* Preload display font */}
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
                    rel="stylesheet"
                />
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
