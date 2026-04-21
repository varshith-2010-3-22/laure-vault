import { NextResponse } from 'next/server'
import { getDiscover } from '@/lib/tmdb'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang')
    const region = searchParams.get('region')
    const cast = searchParams.get('cast')
    const genres = searchParams.get('genres')
    const keywords = searchParams.get('keywords')

    try {
        const data = await getDiscover({
            with_original_language: lang || undefined,
            region: region || undefined,
            with_cast: cast || undefined,
            with_genres: genres || undefined,
            with_keywords: keywords || undefined,
            page: 1,
        })
        return NextResponse.json(data)
    } catch (error) {
        console.error('TMDB Discover API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
    }
}
