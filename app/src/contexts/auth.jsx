import { useState, useEffect } from "react"
import { getUserLocalStorage, setUserLocalStorage } from "../services/api"
import { AuthContext } from "./context"
import { post } from "../services/api"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserLocalStorage("u") ?? null)
  const [loading, setLoading] = useState(user === null)
  const [forgotsend, setForgotsend] = useState(false)

  const authenticate = async (email, data) => {
    setLoading(true)
    try {
      const response = await post("/authenticate", data)

      console.log(response)

      if (response.status === 200) {
        const decodeJwt = (token) => {
          const base64Url = token.split('.')[1]
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
          const jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join(''),
          )
          return JSON.parse(jsonPayload)
        }

        const payloadDecoded = decodeJwt(response.token)
        const payload = { ...response, email, permissions: payloadDecoded }
        setUser(payload)
        setUserLocalStorage('u', payload)
        return true
      }

      logout()
      return false

    } catch (error) {
      logout()
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("u")
    setLoading(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      authenticated: Boolean(user), 
      authenticate, 
      logout, 
      loading, 
      updateForgotsend: setForgotsend, 
      forgotsend 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
