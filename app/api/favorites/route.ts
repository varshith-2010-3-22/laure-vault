import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const favoritesData = await prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { addedAt: 'desc' },
    })

    // Map database shape back to Movie struct
    const favorites = favoritesData.map((f: { tmdbId: number; title: string; posterPath: string }) => ({
        id: f.tmdbId,
        title: f.title,
        poster_path: f.posterPath,
    }))

    return NextResponse.json({ favorites })
}

export async function POST(request: Request) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    // Ensure user exists in our DB before adding a favorite
    await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
            id: user.id,
            email: user.email || '',
        },
    })

    await prisma.favorite.upsert({
        where: {
            userId_tmdbId: {
                userId: user.id,
                tmdbId: body.id,
            }
        },
        update: {},
        create: {
            userId: user.id,
            tmdbId: body.id,
            title: body.title,
            posterPath: body.poster_path || '',
        },
    })

    return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const tmdbId = Number(searchParams.get('tmdbId'))

    try {
        await prisma.favorite.delete({
            where: {
                userId_tmdbId: {
                    userId: user.id,
                    tmdbId,
                }
            }
        })
    } catch {
        // Assume already deleted
    }

    return NextResponse.json({ success: true })
}
