import React from 'react'

const languages = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  // Add more Indian languages as needed
]

interface LanguageSelectorProps {
  language: string
  setLanguage: (lang: string) => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div className="mb-4">
      <label htmlFor="language" className="block mb-1 font-semibold">
        Select Language
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full max-w-xs"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
