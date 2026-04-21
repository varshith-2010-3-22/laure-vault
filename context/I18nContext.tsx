'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const TRANSLATIONS = {
    en: {
        discover: 'Discover',
        vault: 'Vault',
        search: 'Search',
        stories: 'Stories',
        support: 'Support',
        regional: 'Regional',
        popularIn: 'Popular in',
        cinematicCollection: 'Cinematic Collection',
        editorial: 'Editorial',
        beginTyping: 'Begin typing to search',
    },
    hi: {
        discover: 'खोजें',
        vault: 'तिजोरी',
        search: 'खोज',
        stories: 'कहानियां',
        support: 'सहायता',
        regional: 'क्षेत्रीय',
        popularIn: 'लोकप्रिय',
        cinematicCollection: 'सिनेमाई संग्रह',
        editorial: 'संपादकीय',
        beginTyping: 'खोजने के लिए टाइप करना शुरू करें',
    },
    te: {
        discover: 'కనుగొనండి',
        vault: 'వాల్ట్',
        search: 'శోధన',
        stories: 'కథలు',
        support: 'మద్దతు',
        regional: 'ప్రాంతీయ',
        popularIn: 'ప్రసిద్ధ',
        cinematicCollection: 'సినిమా సేకరణ',
        editorial: 'సంపాదకీయం',
        beginTyping: 'వెతకడానికి టైప్ చేయడం ప్రారంభించండి',
    },
    ta: {
        discover: 'கண்டறியவும்',
        vault: 'வால்ட்',
        search: 'தேடல்',
        stories: 'கதைகள்',
        support: 'ஆதரவு',
        regional: 'வட்டார',
        popularIn: 'பிரபலமானது',
        cinematicCollection: 'சினிமா தொகுப்பு',
        editorial: 'தலையங்கம்',
        beginTyping: 'தேட தட்டச்சு செய்யத் தொடங்குங்கள்',
    },
    ml: {
        discover: 'കണ്ടെത്തുക',
        vault: 'വോൾട്ട്',
        search: 'തിരയുക',
        stories: 'കഥകൾ',
        support: 'പിന്തുണ',
        regional: 'പ്രാദേശികം',
        popularIn: 'ജനപ്രിയമായി',
        cinematicCollection: 'സിനിമാറ്റിക് ശേഖരം',
        editorial: 'എഡിറ്റോറിയൽ',
        beginTyping: 'തിരയാൻ ടൈപ്പ് ചെയ്യാൻ തുടങ്ങുക',
    },
    kn: {
        discover: 'ಅನ್ವೇಷಿಸಿ',
        vault: 'ವಾಲ್ಟ್',
        search: 'ಹುಡುಕಾಟ',
        stories: 'ಕಥೆಗಳು',
        support: 'ಬೆಂಬಲ',
        regional: 'ಪ್ರಾದೇಶಿಕ',
        popularIn: 'ಜನಪ್ರಿಯ',
        cinematicCollection: 'ಸಿನಿಮಾ ಸಂಗ್ರಹ',
        editorial: 'ಸಂಪಾದಕೀಯ',
        beginTyping: 'ಹುಡುಕಲು ಟೈಪ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ',
    },
    bn: {
        discover: 'আবিষ্কার করুন',
        vault: 'ভল্ট',
        search: 'অনুসন্ধান',
        stories: 'গল্প',
        support: 'সমর্থন',
        regional: 'আঞ্চলিক',
        popularIn: 'জনপ্রিয়',
        cinematicCollection: 'সিনেমেটিক সংগ্রহ',
        editorial: 'সম্পাদকীয়',
        beginTyping: 'অনুসন্ধান করতে টাইপ করা শুরু করুন',
    },
    mr: {
        discover: 'शोधा',
        vault: 'तिजोरी',
        search: 'शोध',
        stories: 'गोष्टी',
        support: 'आधार',
        regional: 'प्रादेशिक',
        popularIn: 'लोकप्रिय',
        cinematicCollection: 'सिनेमॅटिक संग्रह',
        editorial: 'संपादकीय',
        beginTyping: 'शोधण्यासाठी टाइप करणे सुरू करा',
    }
}

type Locale = keyof typeof TRANSLATIONS
type TranslationKey = keyof typeof TRANSLATIONS['en']

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en')

    const t = (key: TranslationKey) => {
        return TRANSLATIONS[locale][key] || TRANSLATIONS['en'][key]
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (!context) throw new Error('useI18n must be used within I18nProvider')
    return context
}

export const SUPPORTED_LOCALES = [
    { id: 'en', name: 'English' },
    { id: 'hi', name: 'हिन्दी' },
    { id: 'te', name: 'తెలుగు' },
    { id: 'ta', name: 'தமிழ்' },
    { id: 'ml', name: 'മലയാളം' },
    { id: 'kn', name: 'ಕನ್ನಡ' },
    { id: 'bn', name: 'বাংলা' },
    { id: 'mr', name: 'मराठी' },
] as const
