export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('access_token', token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
}
