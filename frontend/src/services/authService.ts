
import { API } from './api'

export interface AuthResponse {
  token: string
  name: string
  role: string
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password')
  }

  return data as AuthResponse
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return data
}
