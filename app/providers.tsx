'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { I18nProvider } from '@/context/I18nContext'
import { DataSaverProvider } from '@/context/DataSaverContext'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, 
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )

    return (
        <DataSaverProvider>
            <I18nProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </I18nProvider>
        </DataSaverProvider>
    )
}
