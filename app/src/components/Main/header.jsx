import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Header = () => {
  const { logout, srcAvatar, data } = useContext(MainContext)

  const avatarSrc = srcAvatar || '/res/admin/avatar/avatar1.png'
  const userName = data?.desuser || 'Usuário'
  const userEmail = data?.desemail || ''

  const handleLogout = (event) => {
    event?.preventDefault()
    logout?.()
  }

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/home" className="nav-link">Início</Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown user-menu">
          <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
            <img src={avatarSrc} className="user-image img-circle elevation-2" alt="Avatar" />
            <span className="d-none d-md-inline">{userName}</span>
          </a>
          <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <li className="user-header bg-primary">
              <img src={avatarSrc} className="img-circle elevation-2" alt="Avatar" />
              <p>{userName}{userEmail && <small>{userEmail}</small>}</p>
            </li>
            <li className="user-footer">
              <button type="button" className="btn btn-default btn-flat btn-sm float-right" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>Sair
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default Header
