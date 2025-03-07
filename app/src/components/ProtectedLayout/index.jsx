import { useContext } from "react"
import { AuthContext } from "../../contexts/context"
import { Navigate } from "react-router-dom"

export const Private = ({ children }) => {

  const { authenticated, loading } = useContext(AuthContext)

  console.log(authenticated)

  if (loading) {
    return (
      <div className="loading">
        <i className="fa fa-refresh fa-spin"></i>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/" />
  }

  return children
}