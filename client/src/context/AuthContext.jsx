import { createContext, useContext, useEffect, useState } from "react"
import { apiRequest, authHeaders } from "../lib/api"

const AuthContext = createContext(null)
const TOKEN_KEY = "gdinnovations_auth_token"

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "")
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setUser(null)
        setAuthLoading(false)
        return
      }

      try {
        const data = await apiRequest("/auth/me", {
          headers: authHeaders(token),
        })
        setUser(data.user)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        setToken("")
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    loadCurrentUser()
  }, [token])

  const login = async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, referralCode = "") => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, referralCode }),
    })
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken("")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        authLoading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
