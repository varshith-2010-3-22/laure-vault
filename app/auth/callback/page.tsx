'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            // The Supabase client automatically parses the hash fragment URL parameters
            // and establishes the session when it loads on this page.
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Callback error:', error)
                router.push('/login')
            } else if (session) {
                // Once the session is successfully parsed and saved locally, 
                // redirect the user back to the application.
                router.push('/')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm font-sans tracking-wide text-grey uppercase animate-pulse">
                Authenticating...
            </p>
        </div>
    )
}
