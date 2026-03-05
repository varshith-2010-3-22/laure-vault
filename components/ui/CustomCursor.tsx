'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: -100, y: -100 })
    const [isHovering, setIsHovering] = useState(false)
    const [isPointer, setIsPointer] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const interactive = target.closest(
                'a, button, [role="button"], input, label, select, textarea, [data-cursor-hover]'
            )
            setIsHovering(!!interactive)

            // Check if it looks like a clickable/pointer target
            const style = window.getComputedStyle(target)
            setIsPointer(style.cursor === 'pointer' || !!interactive)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [])

    return (
        <>
            {/* Outer ring */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border border-ink/30 mix-blend-difference"
                animate={{
                    x: position.x - (isHovering ? 20 : 16),
                    y: position.y - (isHovering ? 20 : 16),
                    width: isHovering ? 40 : 32,
                    height: isHovering ? 40 : 32,
                    opacity: isHovering ? 0.5 : 0.3,
                    filter: isHovering ? 'blur(0px)' : 'blur(0px)',
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 28, mass: 0.5 }}
                style={{ willChange: 'transform' }}
            />

            {/* Inner dot */}
            <motion.div
                aria-hidden="true"
                ref={cursorRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-ink"
                animate={{
                    x: position.x - 3,
                    y: position.y - 3,
                    width: isHovering ? 6 : 6,
                    height: isHovering ? 6 : 6,
                    scale: isPointer ? 0 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.1 }}
                style={{ willChange: 'transform' }}
            />
        </>
    )
}
