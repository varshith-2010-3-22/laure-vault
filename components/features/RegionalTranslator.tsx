'use client'

import { useState } from 'react'
import { useI18n } from '@/context/I18nContext'
import { motion, AnimatePresence } from 'framer-motion'

interface RegionalTranslatorProps {
    originalText: string
}

export default function RegionalTranslator({ originalText }: RegionalTranslatorProps) {
    const { locale } = useI18n()
    const [translatedText, setTranslatedText] = useState('')
    const [isTranslating, setIsTranslating] = useState(false)

    const handleTranslate = async () => {
        if (locale === 'en') return
        setIsTranslating(true)
        
        try {
            // This is where you would call an AI API like Bhasini or Google Translation
            // For now, we simulate the AI translation delay and response
            await new Promise(resolve => setTimeout(resolve, 1200))
            
            // Simulating AI translation response based on locale
            const mockTranslations: Record<string, string> = {
                hi: `[AI अनुवाद]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (यह विवरण हिंदी में अनुवादित किया गया है)`,
                te: `[AI అనువాదం]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (ఈ వివరణ తెలుగులోకి అనువదించబడింది)`,
                ta: `[AI மொழிபெயர்ப்பு]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (இந்த விளக்கம் தமிழில் மொழிபெயர்க்கப்பட்டுள்ளது)`,
                ml: `[AI വിവർത്തനം]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (ഈ വിവരണം മലയാളത്തിലേക്ക് വിവർത്തനം ചെയ്തിട്ടുണ്ട്)`,
                kn: `[AI ಅನುವಾದ]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (ಈ ವಿವರಣೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಲಾಗಿದೆ)`,
                bn: `[AI অনুবাদ]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (এই বর্ণনাটি বাংলায় অনুবাদ করা হয়েছে)`,
                mr: `[AI अनुवाद]: ${originalText.length > 50 ? originalText.substring(0, 100) + '...' : originalText} (हे वर्णन मराठीत अनुवादित केले आहे)`,
            }

            setTranslatedText(mockTranslations[locale] || originalText)
        } catch (error) {
            console.error('Translation failed', error)
        } finally {
            setIsTranslating(false)
        }
    }

    if (locale === 'en') return null

    return (
        <div className="mt-4">
            <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="text-[10px] font-sans uppercase tracking-widest text-ink bg-bone border border-border px-3 py-1 hover:bg-ink hover:text-bone transition-colors relative overflow-hidden"
            >
                {isTranslating ? 'AI Translating...' : `Translate to ${locale.toUpperCase()}`}
            </button>
            
            <AnimatePresence>
                {translatedText && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-ink/5 border-l-2 border-ink text-sm italic font-sans text-ink/80 leading-relaxed"
                    >
                        {translatedText}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
