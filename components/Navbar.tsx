'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { getToken, removeToken } from '../lib/api'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsLoggedIn(!!getToken())
  }, [])

  const handleLogout = () => {
    removeToken()
    setIsLoggedIn(false)
    // Optionally, refresh the page or redirect to home
    window.location.href = '/'
  }

  if (!mounted) return null

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-3xl font-extrabold text-white hover:text-gray-200 transition">
            Voice2Text India
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Login
              </a>
            </Link>
          )}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
