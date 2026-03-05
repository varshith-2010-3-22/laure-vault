import { z } from 'zod'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const IMAGE_SIZES = {
    poster: {
        small: `${TMDB_IMAGE_BASE}/w342`,
        medium: `${TMDB_IMAGE_BASE}/w500`,
        large: `${TMDB_IMAGE_BASE}/w780`,
        original: `${TMDB_IMAGE_BASE}/original`,
    },
    backdrop: {
        small: `${TMDB_IMAGE_BASE}/w780`,
        large: `${TMDB_IMAGE_BASE}/w1280`,
        original: `${TMDB_IMAGE_BASE}/original`,
    },
    profile: {
        small: `${TMDB_IMAGE_BASE}/w185`,
        medium: `${TMDB_IMAGE_BASE}/h632`,
    }
} as const

// ─── Zod Schemas ──────────────────────────────────────────────────

export const MovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    overview: z.string(),
    poster_path: z.string().nullable(),
    backdrop_path: z.string().nullable(),
    vote_average: z.number(),
    vote_count: z.number(),
    release_date: z.string(),
    genre_ids: z.array(z.number()).optional(),
    popularity: z.number().optional(),
    original_language: z.string().optional(),
})

export const CastMemberSchema = z.object({
    id: z.number(),
    name: z.string(),
    character: z.string(),
    profile_path: z.string().nullable(),
})

export const CreditsSchema = z.object({
    cast: z.array(CastMemberSchema),
})

export const MovieDetailSchema = MovieSchema.extend({
    runtime: z.number().nullable(),
    tagline: z.string().optional(),
    genres: z.array(z.object({ id: z.number(), name: z.string() })),
    production_countries: z.array(
        z.object({ iso_3166_1: z.string(), name: z.string() })
    ),
    status: z.string(),
    budget: z.number().optional(),
    revenue: z.number().optional(),
    credits: CreditsSchema.optional(),
})

export const MovieListResponseSchema = z.object({
    page: z.number(),
    results: z.array(MovieSchema),
    total_pages: z.number(),
    total_results: z.number(),
})

export type Movie = z.infer<typeof MovieSchema>
export type MovieDetail = z.infer<typeof MovieDetailSchema>
export type MovieListResponse = z.infer<typeof MovieListResponseSchema>

// ─── Fetch Helper ─────────────────────────────────────────────────

async function tmdbFetch<T>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    params: Record<string, string> = {}
): Promise<T> {
    const token = process.env.TMDB_BEARER_TOKEN

    const url = new URL(`${TMDB_BASE}${endpoint}`)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

    const options: RequestInit = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
        },
        next: { revalidate: 3600 }, // ISR: revalidate every hour
    }

    const res = await fetch(url.toString(), options)

    if (!res.ok) {
        throw new Error(`TMDB API error: ${res.status} ${res.statusText}`)
    }

    const json = await res.json()
    return schema.parse(json)
}

// ─── API Helpers ───────────────────────────────────────────────────

export async function getTrending(
    timeWindow: 'day' | 'week' = 'week',
    page = 1
): Promise<MovieListResponse> {
    return tmdbFetch(
        `/trending/movie/${timeWindow}`,
        MovieListResponseSchema,
        { page: String(page) }
    )
}

export async function getPopular(
    page = 1,
    region?: string
): Promise<MovieListResponse> {
    return tmdbFetch('/movie/popular', MovieListResponseSchema, {
        page: String(page),
        language: 'en-US',
        ...(region ? { region } : {}),
    })
}

export async function searchMovies(
    query: string,
    page = 1
): Promise<MovieListResponse> {
    return tmdbFetch('/search/movie', MovieListResponseSchema, {
        query,
        page: String(page),
        include_adult: 'false',
        language: 'en-US',
    })
}

export async function getMovieDetails(id: number): Promise<MovieDetail> {
    return tmdbFetch(`/movie/${id}`, MovieDetailSchema, {
        append_to_response: 'credits',
    })
}

export async function getNowPlaying(page = 1): Promise<MovieListResponse> {
    return tmdbFetch('/movie/now_playing', MovieListResponseSchema, {
        page: String(page),
        language: 'en-US',
    })
}

export async function getTopRated(page = 1): Promise<MovieListResponse> {
    return tmdbFetch('/movie/top_rated', MovieListResponseSchema, {
        page: String(page),
        language: 'en-US',
    })
}
