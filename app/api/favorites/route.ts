import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.split(' ')[1]
        const { data, error } = await supabase.auth.getUser(token)
        if (error || !data?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const favoritesData = await prisma.favorite.findMany({
            where: { userId: data.user.id },
            orderBy: { addedAt: 'desc' },
        })

        const favorites = favoritesData.map((f) => ({
            id: f.tmdbId,
            title: f.title,
            poster_path: f.posterPath,
        }))

        return NextResponse.json({ favorites })
    } catch (e) {
        console.error('FAVORITES_GET_ERROR:', e)
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.split(' ')[1]
        const { data, error } = await supabase.auth.getUser(token)
        if (error || !data?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()

        await prisma.user.upsert({
            where: { id: data.user.id },
            update: {},
            create: {
                id: data.user.id,
                email: data.user.email || '',
            },
        })

        await prisma.favorite.upsert({
            where: {
                userId_tmdbId: {
                    userId: data.user.id,
                    tmdbId: body.id,
                }
            },
            update: {},
            create: {
                userId: data.user.id,
                tmdbId: body.id,
                title: body.title,
                posterPath: body.poster_path || '',
            },
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('FAVORITES_POST_ERROR:', e)
        return NextResponse.json({ error: 'Failed to update vault' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const token = authHeader.split(' ')[1]
        const { data, error } = await supabase.auth.getUser(token)
        if (error || !data?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const tmdbId = Number(searchParams.get('tmdbId'))

        await prisma.favorite.delete({
            where: {
                userId_tmdbId: {
                    userId: data.user.id,
                    tmdbId,
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('FAVORITES_DELETE_ERROR:', e)
        // If it's a 404/not found, we can still return success
        return NextResponse.json({ success: true })
    }
}
