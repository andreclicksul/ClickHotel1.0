import { useContext } from "react"
import { AuthContext } from "../../contexts/context"
import { Navigate } from "react-router-dom"

export const PrivateEmail = ({ children }) => {

  const { forgotsend } = useContext(AuthContext)

  if (!forgotsend) {
    return <Navigate to="/" />
  }

  return children
}