import { NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q || q.length < 2) {
        return NextResponse.json({ results: [] })
    }

    try {
        const data = await searchMovies(q)
        return NextResponse.json({ results: data.results })
    } catch (err) {
        console.error('[Search API]', err)
        return NextResponse.json({ results: [] }, { status: 500 })
    }
}
