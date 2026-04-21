'use client'

/**
 * A simple utility to cache movie data for offline viewing in India's patchy networks.
 */
export const OfflineVault = {
    async save(movie: any) {
        if (typeof window === 'undefined') return
        const favorites = JSON.parse(localStorage.getItem('offline-vault') || '[]')
        const exists = favorites.find((f: any) => f.id === movie.id)
        if (!exists) {
            favorites.push(movie)
            localStorage.setItem('offline-vault', JSON.stringify(favorites))
        }
    },

    async remove(movieId: number) {
        if (typeof window === 'undefined') return
        const favorites = JSON.parse(localStorage.getItem('offline-vault') || '[]')
        const filtered = favorites.filter((f: any) => f.id !== movieId)
        localStorage.setItem('offline-vault', JSON.stringify(filtered))
    },

    get(): any[] {
        if (typeof window === 'undefined') return []
        return JSON.parse(localStorage.getItem('offline-vault') || '[]')
    }
}
