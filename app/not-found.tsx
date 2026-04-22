import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <p className="text-xs font-sans uppercase tracking-wider text-grey mb-4">
                404
            </p>
            <h1
                className="font-display text-ink leading-none tracking-tighter mb-6"
                style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
                Not Found.
            </h1>
            <p className="text-sm text-grey font-sans mb-8 max-w-sm">
                This film doesn&apos;t exist in our vault — or perhaps it was never meant to be found.
            </p>
            <Link
                href="/"
                className="text-sm font-sans text-ink border-b border-ink pb-0.5 hover:opacity-60 transition-opacity"
                data-cursor-hover
            >
                Return to Discover
            </Link>
        </div>
    )
}
