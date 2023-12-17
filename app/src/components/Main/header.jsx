import { useContext } from "react"
import { Link } from "react-router-dom"
import { MainContext } from "../../contexts/context"

const Header = () => {

  const { logout } = useContext(MainContext)

   return (
    <header id="main-header" className="main-header">
      <Link to="/home" className="logo"> 
        <span className="logo-mini"><b>CLK</b></span>
        <span className="logo-lg"><b>Clicksul</b></span>
      </Link>
      <nav className="navbar navbar-static-top" role="navigation">
        <a href="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span className="sr-only">Toggle navigation</span>
        </a>
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            <li>
              <a href="#" onClick={logout}><i className="fa fa-gears"></i></a>
            </li>
          </ul>
        </div> 
      </nav>      
    </header>
  ) 
}

export default Header