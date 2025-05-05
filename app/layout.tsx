import '../styles/globals.css'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Voice2Text India',
  description: 'Audio to text transcription platform for Indian languages',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
