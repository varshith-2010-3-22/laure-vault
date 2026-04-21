import RegionalHubs from '@/components/features/RegionalHubs'
import SuperstarFandom from '@/components/features/SuperstarFandom'
import CinemaCricket from '@/components/features/CinemaCricket'

export const metadata = {
    title: 'Lumière Vault — Discover Indian Cinema',
}

export default function HomePage() {
    return (
        <div className="px-6 md:px-12 py-16">
            {/* Hero section */}
            <section className="mb-24 pt-8">
                <p className="text-xs font-sans uppercase tracking-wider text-grey mb-4">
                    Editorial / Indian Cinema
                </p>
                <h1
                    className="font-display text-ink leading-none tracking-tighter mb-8"
                    style={{ fontSize: 'clamp(3rem, 10vw, 12rem)' }}
                >
                    Discover
                    <br />
                    <em className="text-grey not-italic">Stories.</em>
                </h1>
                <p className="max-w-md text-sm text-grey font-sans leading-relaxed">
                    Exploring the vast landscape of Indian cinema. From Bollywood blockbusters to regional masterpieces.
                </p>
            </section>

            {/* Regional Hubs Section */}
            <RegionalHubs />

            {/* Superstar Fandom Section */}
            <SuperstarFandom />

            {/* Cricket & Cinema Intersection */}
            <CinemaCricket />
        </div>
    )
}
