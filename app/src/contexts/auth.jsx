import { useState } from "react"
import { getUserLocalStorage, setUserLocalStorage } from "../services/api"
import { AuthContext } from "./context"
import { post } from "../services/api"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserLocalStorage("u") ?? null)
  const [loading, setLoading] = useState(user === null)
  const [forgotsend, setForgotsend] = useState(false)

  const authenticate = async (email, data) => {
    try {
      const response = await post("/authenticate", data)

      console.log(response)

      if (response.status === 200) {
        const payload = { ...response, email }
        setUser(payload)
        setUserLocalStorage("u", payload)
        return true
      }

      logout()
      return false

    } catch (error) {
      logout()
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("u")
  }

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
