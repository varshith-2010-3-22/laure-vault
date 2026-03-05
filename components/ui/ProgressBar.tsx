'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

let timer: ReturnType<typeof setTimeout> | null = null

function createBar() {
    let bar = document.getElementById('lumiere-progress-bar')
    if (!bar) {
        bar = document.createElement('div')
        bar.id = 'lumiere-progress-bar'
        bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9998;
      height: 1px;
      width: 0%;
      background: #1A1A1A;
      transition: width 0.2s ease, opacity 0.4s ease;
      pointer-events: none;
    `
        document.body.appendChild(bar)
    }
    return bar
}

function start() {
    const bar = createBar()
    bar.style.opacity = '1'
    bar.style.width = '0%'
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            bar.style.width = '75%'
        })
    })
}

function finish() {
    const bar = createBar()
    bar.style.width = '100%'
    timer = setTimeout(() => {
        bar.style.opacity = '0'
        setTimeout(() => {
            bar.style.width = '0%'
        }, 400)
    }, 200)
}

export default function ProgressBar() {
    const pathname = usePathname()

    useEffect(() => {
        start()
        const t = setTimeout(finish, 100)
        return () => {
            clearTimeout(t)
            if (timer) clearTimeout(timer)
        }
    }, [pathname])

    return null
}
