import { useEffect, useState } from "react"
import { getUserLocalStorage, setUserLocalStorage } from "../services/api"
import { AuthContext } from "./context"
import { post } from "../services/api"

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)  

  const [forgotsend, setForgotsend] = useState(false)

  useEffect(() => {
    const user = getUserLocalStorage("u")

    if (user) {
      setUser(user)
    }
    
    setLoading(false)
  }, [])

  const authenticate = async (email, Data) => {
    
    const response = await post('/authenticate', Data)
    //const response = await post('login.php', Data)
    console.log(response)

    if (response.status == 200) {
      const payload = { token: response.token, descor: response.descor, desuser: response.name, email}
      setUser(payload)
      setUserLocalStorage("u", payload)
      //apiBearer(response.token) 
      return true
    } else {
      logout()
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{user, authenticated: !!user, authenticate, logout, loading, updateForgotsend: setForgotsend, forgotsend }}>
      {children}
    </AuthContext.Provider>
  )
  
}



