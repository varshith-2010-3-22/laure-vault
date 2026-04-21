'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface DataSaverContextType {
    isDataSaver: boolean
    setDataSaver: (value: boolean) => void
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined)

export function DataSaverProvider({ children }: { children: React.ReactNode }) {
    const [isDataSaver, setIsDataSaver] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('data-saver')
        if (saved === 'true') setIsDataSaver(true)
    }, [])

    const setDataSaver = (value: boolean) => {
        setIsDataSaver(value)
        localStorage.setItem('data-saver', String(value))
    }

    return (
        <DataSaverContext.Provider value={{ isDataSaver, setDataSaver }}>
            {children}
        </DataSaverContext.Provider>
    )
}

export function useDataSaver() {
    const context = useContext(DataSaverContext)
    if (!context) throw new Error('useDataSaver must be used within DataSaverProvider')
    return context
}
