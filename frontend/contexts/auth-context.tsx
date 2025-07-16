"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "../services/api"

// This interface now correctly matches the backend's User model
export interface User {
  id: string
  name: string
  phone: string
  role: "worker" | "employer"
  avatar?: string
  email?: string
  location?: any
  skills?: string[]
  bio?: string
  experience?: string
  companyName?: string
  companyWebsite?: string
  companyDescription?: string
  rating?: { average: number; count: number }
  isVerified?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  sendOTP: (phone: string) => Promise<{ success: boolean; error?: string }>
  verifyOTP: (phone: string, otp: string, role?: string, name?: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (updatedUserData: Partial<User>) => void
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// We will no longer need MOCK_USERS
// const MOCK_USERS: User[] = [ ... ]

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load user and token from localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return

    try {
      const savedToken = localStorage.getItem("kaamsathi-token")
      const savedUser = localStorage.getItem("kaamsathi-user")
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        
        // Verify token is still valid by fetching current user
        api.auth.getMe()
          .then((response) => {
            if (response.status === 'success' && response.data?.user) {
              setUser(response.data.user)
              localStorage.setItem("kaamsathi-user", JSON.stringify(response.data.user))
            }
          })
          .catch((error) => {
            console.error("Token validation failed:", error)
            // Token is invalid, clear auth state
            logout()
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("AuthProvider: Failed to load auth state from localStorage", error)
      localStorage.clear()
      setLoading(false)
    }
  }, [isHydrated])

  const login = useCallback((userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem("kaamsathi-user", JSON.stringify(userData))
      localStorage.setItem("kaamsathi-token", userToken)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call backend logout (to handle token blacklisting if implemented)
      await api.auth.logout()
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      // Clear local state regardless of API call result
      setUser(null)
      setToken(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("kaamsathi-user")
        localStorage.removeItem("kaamsathi-token")
        localStorage.removeItem("kaamsathi-user-intent")
      }
    }
  }, [])
  
  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      if (user) {
        const newUser = { ...user, ...updatedUserData }
        setUser(newUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem("kaamsathi-user", JSON.stringify(newUser))
        }
      }
    },
    [user],
  )

  const sendOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.auth.sendOTP(phone)
      
      if (response.status === 'success') {
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to send OTP' }
      }
    } catch (error: any) {
      console.error("Send OTP error:", error)
      return { success: false, error: error.message || "Cannot connect to the server." }
    }
  }

  const verifyOTP = async (
    phone: string, 
    otp: string, 
    role?: string, 
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userRole = role || localStorage.getItem("kaamsathi-user-intent") || "worker"
      const response = await api.auth.verifyOTP(phone, otp, userRole, name)
      
      if (response.status === 'success' && response.data) {
        const { token: userToken, user: userData } = response.data
        if (userData && userToken) {
          login(userData, userToken)
          // Clear user intent after successful login
          if (typeof window !== 'undefined') {
            localStorage.removeItem("kaamsathi-user-intent")
          }
          return { success: true }
        } else {
          return { success: false, error: "Invalid user data from server." }
        }
      } else {
        return { success: false, error: response.message || 'Failed to verify OTP' }
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error)
      return { success: false, error: error.message || "Cannot connect to the server." }
    }
  }

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await api.auth.refreshToken()
      
      if (response.status === 'success' && response.data?.token) {
        setToken(response.data.token)
        if (typeof window !== 'undefined') {
          localStorage.setItem("kaamsathi-token", response.data.token)
        }
      } else {
        throw new Error("Failed to refresh token")
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      logout() // Force logout if refresh fails
    }
  }

  const isAuthenticated = !loading && !!user && !!token

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      loading, 
      sendOTP, 
      verifyOTP, 
      updateUser, 
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
